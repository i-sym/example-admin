import { createServer } from 'node:http'
import { OpenAPIGenerator } from '@orpc/openapi'
import { OpenAPIHandler } from '@orpc/openapi/node'
import { CORSPlugin } from '@orpc/server/plugins'
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod'
import { router } from './orpc-router'
import { getFilenameFromContentDisposition } from '@orpc/standard-server'
import { RPCHandler } from '@orpc/server/node'


const OVERRIDE_BODY_CONTEXT = Symbol('OVERRIDE_BODY_CONTEXT')

interface OverrideBodyContext {
  fetchRequest: Request
}

const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin(),
    new ZodSmartCoercionPlugin(),
  ]
})

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [
    new ZodToJsonSchemaConverter(),
  ],
})

export const externalServer = createServer(async (req, res) => {
  const { matched } = await openAPIHandler.handle(req, res, {
    prefix: '/api',

  })

  if (matched) {
    return
  }

  if (req.url === '/spec.json') {
    const spec = await openAPIGenerator.generate(router, {
      info: {
        title: 'Example Admin API',
        version: '0.1.0',
      },
      servers: [
        { url: '/api' }, /** Should use absolute URLs in production */
      ],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(spec))
    return
  }

  const html = `
    <!doctype html>
    <html>
      <head>
        <title>API Documentation</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css" />
        <style>
          html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
          }
          *, *:before, *:after {
            box-sizing: inherit;
          }
          body {
            margin:0;
            background: #fafafa;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: '/spec.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "StandaloneLayout",
              requestInterceptor: (request) => {
                request.headers['Authorization'] = 'Bearer default-token';
                return request;
              }
            });
          };
        </script>
      </body>
    </html>
  `

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
})
