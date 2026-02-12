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
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID v4 (random) and v7 (time-sortable) identifiers',
    path: '/tools/uuid-generator',
    category: 'Data',
    keywords: ['uuid', 'guid', 'unique id', 'v4', 'v7', 'generate', 'random'],
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert Unix timestamps to dates and vice versa',
    path: '/tools/timestamp-converter',
    category: 'Data',
    keywords: ['unix', 'timestamp', 'epoch', 'date', 'time', 'convert', 'utc'],
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes from text',
    path: '/tools/hash-generator',
    category: 'Security',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'checksum', 'digest'],
  },
]
