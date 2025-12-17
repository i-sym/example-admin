/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
    PeriodicExportingMetricReader,
    ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';


const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'ems-fusebox-adapter',
        [ATTR_SERVICE_VERSION]: process.env.npm_package_version || 'unknown',
    }),
    traceExporter: new OTLPTraceExporter({

        url: process.env.BETTERSTACK_OTLP_ENDPOINT || 'https://otel.betterstack.com/v1/traces',
        headers: {
            'Authorization': `Bearer ${process.env.BETTERSTACK_SOURCE_TOKEN}`,
        },
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
    }),

    instrumentations: [getNodeAutoInstrumentations({
        // Disable net instrumentation to avoid bloating traces
        '@opentelemetry/instrumentation-net': {
            enabled: false,
        }

    })],
});

sdk.start();

console.log('OpenTelemetry instrumentation initialized');