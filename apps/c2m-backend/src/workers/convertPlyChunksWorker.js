import { parentPort } from 'node:worker_threads';
import fs from 'fs';
import path from 'path';
import { processPlyBuffer } from './convert_ply_to_splat_mc3.js';

// ============= Quaternion Utilities =============

class Quat {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    // Multiply two quaternions: this * q (applies q first, then this)
    multiply(q) {
        const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
        const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
        return new Quat(x, y, z, w);
    }

    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        if (len < 1e-10) return new Quat(0, 0, 0, 1);
        return new Quat(this.x / len, this.y / len, this.z / len, this.w / len);
    }

    // Convert to rotation matrix (column-major for right-multiplication)
    toMatrix() {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;

        // This matrix transforms vectors: v' = M * v
        return [
            [1 - (yy + zz), xy - wz, xz + wy],
            [xy + wz, 1 - (xx + zz), yz - wx],
            [xz - wy, yz + wx, 1 - (xx + yy)]
        ];
    }

    rotateVector(v) {
        const [x, y, z] = v;
        const mat = this.toMatrix();
        return [
            mat[0][0] * x + mat[0][1] * y + mat[0][2] * z,
            mat[1][0] * x + mat[1][1] * y + mat[1][2] * z,
            mat[2][0] * x + mat[2][1] * y + mat[2][2] * z
        ];
    }
}

// ============= Transform Function =============

function transformGaussian(position, rotation, scale, transform) {
    const [x0, y0, z0] = position;
    const [rotX0, rotY0, rotZ0, rotW0] = rotation;
    const [scaleX0, scaleY0, scaleZ0] = scale;

    // Create quaternions
    const worldQuat = new Quat(
        transform.rotateQuat[0],
        transform.rotateQuat[1],
        transform.rotateQuat[2],
        transform.rotateQuat[3]
    ).normalize();

    const gaussianQuat = new Quat(rotX0, rotY0, rotZ0, rotW0).normalize();

    // Get uniform scale factor (use first component if all equal)
    const sx = transform.scale[0];
    const sy = transform.scale[1];
    const sz = transform.scale[2];
    const isUniformScale =
        Math.abs(sx - sy) < 1e-6 && Math.abs(sy - sz) < 1e-6;

    let newPos, newRot, newScale;

    if (isUniformScale) {
        // ===== UNIFORM SCALE PATH =====
        const s = sx;

        // 1. Rotate position around origin
        const rotatedPos = worldQuat.rotateVector([x0, y0, z0]);

        // 2. Scale position
        const scaledPos = [
            rotatedPos[0] * s,
            rotatedPos[1] * s,
            rotatedPos[2] * s
        ];

        // 3. Translate
        newPos = [
            scaledPos[0] + transform.translate[0],
            scaledPos[1] + transform.translate[1],
            scaledPos[2] + transform.translate[2]
        ];

        // 4. Compose rotations: new_rotation = world_rotation * gaussian_rotation
        const composedQuat = worldQuat.multiply(gaussianQuat).normalize();
        newRot = [composedQuat.x, composedQuat.y, composedQuat.z, composedQuat.w];

        // 5. Scale the gaussian's scale
        newScale = [scaleX0 * 2, scaleY0 * 2, scaleZ0 * 2];

    } else {
        // ===== NON-UNIFORM SCALE PATH =====

        // Build combined transformation matrix M = S * R
        const R = worldQuat.toMatrix();
        const S = [
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, sz]
        ];
        const M = matrixMultiply(S, R);

        // Transform position
        const transformedPos = multiplyMatVec(M, [x0, y0, z0]);
        newPos = [
            transformedPos[0] + transform.translate[0],
            transformedPos[1] + transform.translate[1],
            transformedPos[2] + transform.translate[2]
        ];

        // Build gaussian's RS matrix
        const R_g = gaussianQuat.toMatrix();
        const S_g = [
            [scaleX0, 0, 0],
            [0, scaleY0, 0],
            [0, 0, scaleZ0]
        ];
        const RS_g = matrixMultiply(R_g, S_g);

        // Transform: new_RS = M * RS_g
        const newRS = matrixMultiply(M, RS_g);

        // Decompose back to rotation + scale
        const { rotation: R_new, scale: S_new } = qrDecompose(newRS);

        // Convert rotation matrix to quaternion
        const newQuat = matrixToQuaternion(R_new);
        newRot = [newQuat.x, newQuat.y, newQuat.z, newQuat.w];
        newScale = [scaleX0 * sx, scaleY0 * sy, scaleZ0 * sz];
    }

    return {
        position: newPos,
        rotation: newRot,
        scale: newScale
    };
}

// ============= Matrix Utilities =============

function matrixMultiply(A, B) {
    const result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function multiplyMatVec(M, v) {
    return [
        M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
        M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
        M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2]
    ];
}

// QR decomposition using Gram-Schmidt
function qrDecompose(M) {
    const col0 = [M[0][0], M[1][0], M[2][0]];
    const col1 = [M[0][1], M[1][1], M[2][1]];
    const col2 = [M[0][2], M[1][2], M[2][2]];

    const scaleX = length(col0);
    const q0 = scale(col0, 1 / scaleX);

    const proj1 = subtract(col1, scale(q0, dot(q0, col1)));
    const scaleY = length(proj1);
    const q1 = scale(proj1, 1 / scaleY);

    let proj2 = subtract(col2, scale(q0, dot(q0, col2)));
    proj2 = subtract(proj2, scale(q1, dot(q1, proj2)));
    const scaleZ = length(proj2);
    const q2 = scale(proj2, 1 / scaleZ);

    const rotation = [
        [q0[0], q1[0], q2[0]],
        [q0[1], q1[1], q2[1]],
        [q0[2], q1[2], q2[2]]
    ];

    return {
        rotation,
        scale: [scaleX, scaleY, scaleZ]
    };
}

function matrixToQuaternion(m) {
    const trace = m[0][0] + m[1][1] + m[2][2];
    let x, y, z, w;

    if (trace > 0) {
        const s = 0.5 / Math.sqrt(trace + 1.0);
        w = 0.25 / s;
        x = (m[2][1] - m[1][2]) * s;
        y = (m[0][2] - m[2][0]) * s;
        z = (m[1][0] - m[0][1]) * s;
    } else if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
        const s = 2.0 * Math.sqrt(1.0 + m[0][0] - m[1][1] - m[2][2]);
        w = (m[2][1] - m[1][2]) / s;
        x = 0.25 * s;
        y = (m[0][1] + m[1][0]) / s;
        z = (m[0][2] + m[2][0]) / s;
    } else if (m[1][1] > m[2][2]) {
        const s = 2.0 * Math.sqrt(1.0 + m[1][1] - m[0][0] - m[2][2]);
        w = (m[0][2] - m[2][0]) / s;
        x = (m[0][1] + m[1][0]) / s;
        y = 0.25 * s;
        z = (m[1][2] + m[2][1]) / s;
    } else {
        const s = 2.0 * Math.sqrt(1.0 + m[2][2] - m[0][0] - m[1][1]);
        w = (m[1][0] - m[0][1]) / s;
        x = (m[0][2] + m[2][0]) / s;
        y = (m[1][2] + m[2][1]) / s;
        z = 0.25 * s;
    }

    return new Quat(x, y, z, w).normalize();
}

// Vector helpers
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function length(v) { return Math.sqrt(dot(v, v)); }
function scale(v, s) { return [v[0] * s, v[1] * s, v[2] * s]; }
function subtract(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }

function parsePlyHeader(buffer) {
    const ubuf = new Uint8Array(buffer);
    const header = new TextDecoder().decode(ubuf.slice(0, 1024 * 10));
    const header_end = "end_header\n";
    const header_end_index = header.indexOf(header_end);

    if (header_end_index < 0)
        throw new Error("Unable to read .ply file header");

    const vertexCount = parseInt(/element vertex (\d+)\n/.exec(header)[1]);

    let row_offset = 0,
        offsets = {},
        types = {};

    const TYPE_MAP = {
        double: "getFloat64",
        int: "getInt32",
        uint: "getUint32",
        float: "getFloat32",
        short: "getInt16",
        ushort: "getUint16",
        uchar: "getUint8",
    };

    for (let prop of header
        .slice(0, header_end_index)
        .split("\n")
        .filter((k) => k.startsWith("property "))) {
        const [p, type, name] = prop.split(" ");
        const arrayType = TYPE_MAP[type] || "getInt8";
        types[name] = arrayType;
        offsets[name] = row_offset;
        row_offset += parseInt(arrayType.replace(/[^\d]/g, "")) / 8;
    }

    return {
        vertexCount,
        header_end_index,
        header_end,
        row_offset,
        offsets,
        types,
        header
    };
}

function getChunkKey(x, y, chunkSize) {

    // return `0_0`;

    const cx = Math.floor(x / chunkSize);
    const cy = Math.floor(y / chunkSize);
    return `${cx}_${cy}`;
}

parentPort?.on('message', async (msg) => {
    try {


        const { plyFilePath, outputDir } = msg;
        const data = fs.readFileSync(plyFilePath);
        const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        const {
            vertexCount,
            header_end_index,
            header_end,
            row_offset,
            offsets,
            types,
            header
        } = parsePlyHeader(buffer);
        const dataView = new DataView(buffer, header_end_index + header_end.length);
        const chunkSize = 2; // meters
        const chunks = {};
        const chunkStats = {}; // 
        /*
            "0_0": {
                count: 1234,
                scale: {
                    x: { min: 0.1, max: 2.0 },
                    y: { min: 0.1, max: 2.0 },
                    z: { min: 0.1, max: 2.0 },
                },
                position: {
                    x: { min: -10, max: 10 },
                    y: { min: -5, max: 5 },
                    z: { min: -10, max: 10 },
                }
            }
        */


        // Identity gaussian at (1, 0, 0) with no rotation
        const test = transformGaussian(
            [1, 0, 0],  // position
            [0, 0, 0, 1],  // identity rotation
            [1, 1, 1],  // unit scale
            {
                scale: [1, 1, 1],
                translate: [0, 0, 0],
                rotateQuat: [0.7071, 0, 0, 0.7071]  // 90° around X
            }
        );
        console.log('Rotated position:', test.position);
        // Should be approximately [1, 0, 0] (X-axis rotation doesn't move points on X-axis)

        // Test point on Y-axis
        const test2 = transformGaussian(
            [0, 1, 0],
            [0, 0, 0, 1],
            [1, 1, 1],
            {
                scale: [1, 1, 1],
                translate: [0, 0, 0],
                rotateQuat: [0.7071, 0, 0, 0.7071]
            }
        );
        console.log('Rotated Y point:', test2.position);





        // First pass: assign points to chunks
        for (let row = 0; row < vertexCount; row++) {

            function quatFromEuler(rx, ry, rz) {
                const cy = Math.cos(rz * 0.5);
                const sy = Math.sin(rz * 0.5);
                const cp = Math.cos(ry * 0.5);
                const sp = Math.sin(ry * 0.5);
                const cr = Math.cos(rx * 0.5);
                const sr = Math.sin(rx * 0.5);
                return [
                    sr * cp * cy - cr * sp * sy,
                    cr * sp * cy + sr * cp * sy,
                    cr * cp * sy - sr * sp * cy,
                    cr * cp * cy + sr * sp * sy
                ];
            }

            const transform = {
                scale: [10, 10, 10],
                translate: [0, 0, 0],
                rotateQuat: quatFromEuler(-Math.PI / 2, 0, 0),
            }

            const x0 = dataView.getFloat32(row * row_offset + offsets['x'], true);
            const y0 = dataView.getFloat32(row * row_offset + offsets['y'], true);
            const z0 = dataView.getFloat32(row * row_offset + offsets['z'], true);

            const rotX0 = dataView.getFloat32(row * row_offset + offsets['rot_1'], true);
            const rotY0 = dataView.getFloat32(row * row_offset + offsets['rot_2'], true);
            const rotZ0 = dataView.getFloat32(row * row_offset + offsets['rot_3'], true);
            const rotW0 = dataView.getFloat32(row * row_offset + offsets['rot_0'], true);

            const scaleX0 = types["scale_0"] ? dataView.getFloat32(row * row_offset + offsets['scale_0'], true) : 1;
            const scaleY0 = types["scale_1"] ? dataView.getFloat32(row * row_offset + offsets['scale_1'], true) : 1;
            const scaleZ0 = types["scale_2"] ? dataView.getFloat32(row * row_offset + offsets['scale_2'], true) : 1;

            const colorR = types["f_dc_0"] ? dataView[types["f_dc_0"]](row * row_offset + offsets['f_dc_0'], true) : 1;
            const colorG = types["f_dc_1"] ? dataView[types["f_dc_1"]](row * row_offset + offsets['f_dc_1'], true) : 1;
            const colorB = types["f_dc_2"] ? dataView[types["f_dc_2"]](row * row_offset + offsets['f_dc_2'], true) : 1;
            const colorA = types["opacity"] ? (1 / (1 + Math.exp(-dataView.getFloat32(row * row_offset + offsets['opacity'], true)))) : 1;

            const colorE1 = types["f_dc_3"] ? dataView[types["f_dc_3"]](row * row_offset + offsets['f_dc_3'], true) : 1;
            const colorE2 = types["f_dc_4"] ? dataView[types["f_dc_4"]](row * row_offset + offsets['f_dc_4'], true) : 1;
            const colorE3 = types["f_dc_5"] ? dataView[types["f_dc_5"]](row * row_offset + offsets['f_dc_5'], true) : 1;
            const colorE4 = types["f_dc_6"] ? dataView[types["f_dc_6"]](row * row_offset + offsets['f_dc_6'], true) : 1;
            const colorE5 = types["f_dc_7"] ? dataView[types["f_dc_7"]](row * row_offset + offsets['f_dc_7'], true) : 1;

            // position' = s * (R @ position) + t
            // rotation' = R * rotation  # compose rotations (quaternion multiply)
            // scale' = s * scale

            const position = [x0, y0, z0];
            const rotation = [rotX0, rotY0, rotZ0, rotW0];
            const scale = [scaleX0, scaleY0, scaleZ0];


            const transformed = transformGaussian(position, rotation, scale, transform);

            const positionWithinChunk = [
                transformed.position[0] - Math.floor(transformed.position[0] / chunkSize) * chunkSize,
                transformed.position[1],
                transformed.position[2] - Math.floor(transformed.position[2] / chunkSize) * chunkSize,
            ];
            // Write back to DataView
            dataView.setFloat32(row * row_offset + offsets['x'], positionWithinChunk[0], true);
            dataView.setFloat32(row * row_offset + offsets['y'], positionWithinChunk[1], true);
            dataView.setFloat32(row * row_offset + offsets['z'], positionWithinChunk[2], true);

            dataView.setFloat32(row * row_offset + offsets['rot_1'], transformed.rotation[0], true);
            dataView.setFloat32(row * row_offset + offsets['rot_2'], transformed.rotation[1], true);
            dataView.setFloat32(row * row_offset + offsets['rot_3'], transformed.rotation[2], true);
            dataView.setFloat32(row * row_offset + offsets['rot_0'], transformed.rotation[3], true);


            const scaleX1Ln = Math.log(transformed.scale[0]);
            const scaleY1Ln = Math.log(transformed.scale[1]);
            const scaleZ1Ln = Math.log(transformed.scale[2]);


            dataView.setFloat32(row * row_offset + offsets['scale_0'], scaleX1Ln, true);
            dataView.setFloat32(row * row_offset + offsets['scale_1'], scaleY1Ln, true);
            dataView.setFloat32(row * row_offset + offsets['scale_2'], scaleZ1Ln, true);


            const key = getChunkKey(transformed.position[0], transformed.position[2], chunkSize);
            if (!chunks[key]) {
                chunks[key] = [];
            }

            if (!chunkStats[key]) {
                chunkStats[key] = {
                    count: 1,
                    scale: {
                        x: { min: transformed.scale[0], max: transformed.scale[0] },
                        y: { min: transformed.scale[1], max: transformed.scale[1] },
                        z: { min: transformed.scale[2], max: transformed.scale[2] },
                    },
                    position: {
                        x: { min: transformed.position[0], max: transformed.position[0] },
                        y: { min: transformed.position[1], max: transformed.position[1] },
                        z: { min: transformed.position[2], max: transformed.position[2] },
                    },
                    colors: {
                        r: { min: colorR, max: colorR },
                        g: { min: colorG, max: colorG },
                        b: { min: colorB, max: colorB },
                        a: { min: colorA, max: colorA },
                        e1: { min: colorE1, max: colorE1 },
                        e2: { min: colorE2, max: colorE2 },
                        e3: { min: colorE3, max: colorE3 },
                        e4: { min: colorE4, max: colorE4 },
                        e5: { min: colorE5, max: colorE5 },
                    }
                };
            } else {
                chunkStats[key].count += 1;
                // Update scale mins/maxs
                ['x', 'y', 'z'].forEach((axis, i) => {
                    if (transformed.scale[i] < chunkStats[key].scale[axis].min) {
                        chunkStats[key].scale[axis].min = transformed.scale[i];
                    }
                    if (transformed.scale[i] > chunkStats[key].scale[axis].max) {
                        chunkStats[key].scale[axis].max = transformed.scale[i];
                    }
                    // Update position mins/maxs    
                    if (transformed.position[i] < chunkStats[key].position[axis].min) {
                        chunkStats[key].position[axis].min = transformed.position[i];
                    }
                    if (transformed.position[i] > chunkStats[key].position[axis].max) {
                        chunkStats[key].position[axis].max = transformed.position[i];
                    }

                    // Update color mins/maxs
                    const colorKeys = ['r', 'g', 'b', 'a', 'e1', 'e2', 'e3', 'e4', 'e5'];
                    const colorValues = [colorR, colorG, colorB, colorA, colorE1, colorE2, colorE3, colorE4, colorE5];
                    colorKeys.forEach((cKey, ci) => {
                        if (colorValues[ci] < chunkStats[key].colors[cKey].min) {
                            chunkStats[key].colors[cKey].min = colorValues[ci];
                        }
                        if (colorValues[ci] > chunkStats[key].colors[cKey].max) {
                            chunkStats[key].colors[cKey].max = colorValues[ci];
                        }
                    });
                });
            }

            chunks[key].push({ originalRow: row });




        }

        // Prepare output dir
        const plyName = path.basename(plyFilePath, '.ply');
        const chunkOutputDir = path.join(outputDir, plyName);
        fs.mkdirSync(chunkOutputDir, { recursive: true });
        // For each chunk, build buffer and save

        const createdFiles = [];
        for (const key of Object.keys(chunks)) {
            const rows = chunks[key];
            const rowLength = 3 * 4 + 3 * 4 + 8 + 4; // as in processPlyBuffer
            const chunkBuffer = new ArrayBuffer(rowLength * rows.length);

            for (let j = 0; j < rows.length; j++) {
                const row = rows[j].originalRow

                const position = new Float32Array(chunkBuffer, j * rowLength, 3);
                const scales = new Float32Array(chunkBuffer, j * rowLength + 4 * 3, 3);
                const rgbax = new Uint8ClampedArray(chunkBuffer, j * rowLength + 4 * 3 + 4 * 3, 8);
                const rot = new Uint8ClampedArray(chunkBuffer, j * rowLength + 4 * 3 + 4 * 3 + 8, 4);
                // Copy logic from processPlyBuffer for each attribute
                if (types["scale_0"]) {
                    const qlen = Math.sqrt(
                        dataView.getFloat32(row * row_offset + offsets['rot_0'], true) ** 2 +
                        dataView.getFloat32(row * row_offset + offsets['rot_1'], true) ** 2 +
                        dataView.getFloat32(row * row_offset + offsets['rot_2'], true) ** 2 +
                        dataView.getFloat32(row * row_offset + offsets['rot_3'], true) ** 2
                    );
                    rot[0] = (dataView.getFloat32(row * row_offset + offsets['rot_0'], true) / qlen) * 128 + 128;
                    rot[1] = (dataView.getFloat32(row * row_offset + offsets['rot_1'], true) / qlen) * 128 + 128;
                    rot[2] = (dataView.getFloat32(row * row_offset + offsets['rot_2'], true) / qlen) * 128 + 128;
                    rot[3] = (dataView.getFloat32(row * row_offset + offsets['rot_3'], true) / qlen) * 128 + 128;
                    scales[0] = Math.exp(dataView.getFloat32(row * row_offset + offsets['scale_0'], true));
                    scales[1] = Math.exp(dataView.getFloat32(row * row_offset + offsets['scale_1'], true));
                    scales[2] = Math.exp(dataView.getFloat32(row * row_offset + offsets['scale_2'], true));
                } else {
                    scales[0] = 0.01;
                    scales[1] = 0.01;
                    scales[2] = 0.01;
                    rot[0] = 255;
                    rot[1] = 0;
                    rot[2] = 0;
                    rot[3] = 0;
                }


                position[0] = dataView.getFloat32(row * row_offset + offsets['x'], true);
                position[1] = dataView.getFloat32(row * row_offset + offsets['y'], true);
                position[2] = dataView.getFloat32(row * row_offset + offsets['z'], true);

                if (types["opacity"]) {
                    rgbax[0] = (1 / (1 + Math.exp(-dataView.getFloat32(row * row_offset + offsets['opacity'], true)))) * 255;
                } else {
                    rgbax[0] = 255;
                }
                for (let i = 0; i < 8; i++) {
                    if (types[`f_dc_${i}`]) {
                        // rgbax[i + 1] = dataView[types[`f_dc_${i}`]](row * row_offset + offsets[`f_dc_${i}`], true) * 255;

                        /*
                        C0 = 0.28209479177387814
                        return (rgb - 0.5) / C0
                        (do inverse)
                        */
                        const coeff = 0.28209479177387814;
                        const rgb = dataView[types[`f_dc_${i}`]](row * row_offset + offsets[`f_dc_${i}`], true) * coeff + 0.5;
                        rgbax[i + 1] = Math.min(255, Math.max(0, Math.floor(rgb * 255)));

                    } else {
                        rgbax[i + 1] = 255;
                    }
                }
            }
            const outPath = path.join(chunkOutputDir, `${key}.splat`);
            fs.writeFileSync(outPath, Buffer.from(chunkBuffer));
            createdFiles.push(outPath);
        }

        // Write chunk stats
        const statsPath = path.join(chunkOutputDir, `chunk_stats.json`);
        fs.writeFileSync(statsPath, JSON.stringify(chunkStats, null, 2));
        createdFiles.push(statsPath);

        parentPort?.postMessage({ status: 'success', files: createdFiles });
    } catch (err) {
        parentPort?.postMessage({ status: 'error', error: err instanceof Error ? err.message : String(err) });
    }
});
