// This works well to convert ply to splat
import fs from 'fs';

export function processPlyBuffer(inputBuffer) {
  const ubuf = new Uint8Array(inputBuffer);
  // 10KB ought to be enough for a header...
  const header = new TextDecoder().decode(ubuf.slice(0, 1024 * 10));
  const header_end = "end_header\n";
  const header_end_index = header.indexOf(header_end);
  if (header_end_index < 0)
    throw new Error("Unable to read .ply file header");
  const vertexCount = parseInt(/element vertex (\d+)\n/.exec(header)[1]);
  console.log("Vertex Count", vertexCount);
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

  console.log("TYPE_MAP", TYPE_MAP);
  console.log("header", header);
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
  console.log("Bytes per row", row_offset, types, offsets);

  let dataView = new DataView(
    inputBuffer,
    header_end_index + header_end.length,
  );

  console.log("dataView built");
  let row = 0;
  const attrs = new Proxy(
    {},
    {
      get(target, prop) {
        if (!types[prop]) throw new Error(prop + " not found");
        return dataView[types[prop]](
          row * row_offset + offsets[prop],
          true,
        );
      },
    },
  );

  console.time("calculate importance");
  let sizeList = new Float32Array(vertexCount);
  let sizeIndex = new Uint32Array(vertexCount);
  for (row = 0; row < vertexCount; row++) {
    sizeIndex[row] = row;
    if (!types["scale_0"]) continue;
    const size =
      Math.exp(attrs.scale_0) *
      Math.exp(attrs.scale_1) *
      Math.exp(attrs.scale_2);
    const opacity = 1 / (1 + Math.exp(-attrs.opacity));
    sizeList[row] = size * opacity;
  }
  console.timeEnd("calculate importance");

  console.time("sort");
  sizeIndex.sort((b, a) => sizeList[a] - sizeList[b]);
  console.timeEnd("sort");


  const rgbaxSize = 8 // We will use 8 bytes for RGBA, InfraRed, and RedEdge....

  // 6*4 + 4 + 4 = 8*4
  // XYZ - Position (Float32)
  // XYZ - Scale (Float32)
  // RGBA - colors (uint8)
  // IJKL - quaternion/rot (uint8)
  const rowLength = 3 * 4 + 3 * 4 + rgbaxSize + 4;
  const buffer = new ArrayBuffer(rowLength * vertexCount);


  let minDc = 255;
  let maxDc = 0;

  console.time("build buffer");
  for (let j = 0; j < vertexCount; j++) {
    row = sizeIndex[j];

    const position = new Float32Array(buffer, j * rowLength, 3);
    const scales = new Float32Array(buffer, j * rowLength + 4 * 3, 3);
    const rgbax = new Uint8ClampedArray(
      buffer,
      j * rowLength + 4 * 3 + 4 * 3,
      rgbaxSize,
    );
    const rot = new Uint8ClampedArray(
      buffer,
      j * rowLength + 4 * 3 + 4 * 3 + rgbaxSize,
      4,
    );

    if (types["scale_0"]) {
      const qlen = Math.sqrt(
        attrs.rot_0 ** 2 +
        attrs.rot_1 ** 2 +
        attrs.rot_2 ** 2 +
        attrs.rot_3 ** 2,
      );

      rot[0] = (attrs.rot_0 / qlen) * 128 + 128;
      rot[1] = (attrs.rot_1 / qlen) * 128 + 128;
      rot[2] = (attrs.rot_2 / qlen) * 128 + 128;
      rot[3] = (attrs.rot_3 / qlen) * 128 + 128;

      scales[0] = Math.exp(attrs.scale_0);
      scales[1] = Math.exp(attrs.scale_1);
      scales[2] = Math.exp(attrs.scale_2);
    } else {
      scales[0] = 0.01;
      scales[1] = 0.01;
      scales[2] = 0.01;

      rot[0] = 255;
      rot[1] = 0;
      rot[2] = 0;
      rot[3] = 0;
    }

    position[0] = attrs.x;
    position[1] = attrs.y;
    position[2] = attrs.z;

    // First byte is a - opacity (0-255)
    // All next ones (f_dc_[n]) are colors (0-255)

    // if (types["f_dc_0"]) {
    //   const SH_C0 = 0.28209479177387814;
    //   rgba[0] = attrs.f_dc_0 * 255;
    //   rgba[1] = attrs.f_dc_3 * 255;
    //   rgba[2] = attrs.f_dc_3 * 255;
    // } else {
    //   rgbax[0] = attrs.red;
    //   rgbax[1] = attrs.green;
    //   rgbax[2] = attrs.blue;
    // }
    // if (types["opacity"]) {
    //   rgba[3] = (1 / (1 + Math.exp(-attrs.opacity))) * 255;
    // } else {
    //   rgba[3] = 255;
    // }

    if (types["opacity"]) {
      rgbax[0] = (1 / (1 + Math.exp(-attrs.opacity))) * 255;
    } else {
      rgbax[0] = 255;
    }



    for (let i = 0; i < rgbaxSize; i++) {
      if (types[`f_dc_${i}`]) {
        rgbax[i + 1] = attrs[`f_dc_${i}`] * 255;

        minDc = Math.min(minDc, rgbax[i + 1]);
        maxDc = Math.max(maxDc, rgbax[i + 1]);
      } else {
        rgbax[i + 1] = 255;
      }
    }

    // Swap channels  4 and 5
    // const temp = rgbax[4];
    // rgbax[4] = rgbax[5];
    // rgbax[5] = temp;
  }
  console.timeEnd("build buffer");

  console.log("minDc", minDc, "maxDc", maxDc);

  return buffer;
}

