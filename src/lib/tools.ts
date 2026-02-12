export interface Tool {
  id: string
  name: string
  description: string
  path: string
  category: string
  keywords: string[]
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data with syntax highlighting',
    path: '/tools/json-formatter',
    category: 'Data',
    keywords: ['json', 'format', 'validate', 'beautify', 'minify', 'pretty print'],
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings instantly',
    path: '/tools/base64',
    category: 'Encoding',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text'],
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    description: 'Parse and explain cron expressions in human-readable format',
    path: '/tools/cron-parser',
    category: 'DevOps',
    keywords: ['cron', 'crontab', 'schedule', 'expression', 'parser'],
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) — header, payload, and signature',
    path: '/tools/jwt-decoder',
    category: 'Security',
    keywords: ['jwt', 'json web token', 'decode', 'header', 'payload', 'claim'],
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL components and query strings',
    path: '/tools/url-encoder',
    category: 'Encoding',
    keywords: ['url', 'encode', 'decode', 'percent encoding', 'uri', 'query string'],
  },
]
