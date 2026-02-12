// Generate sitemap.xml after build
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// TODO: Change to custom domain once bound
const BASE_URL = 'https://devtoolkit-dws.pages.dev'

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools/json-formatter', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/base64', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/cron-parser', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/jwt-decoder', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/url-encoder', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/uuid-generator', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/timestamp-converter', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/hash-generator', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/password-generator', priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/diff-checker', priority: '0.9', changefreq: 'monthly' },
  { path: '/api', priority: '0.8', changefreq: 'weekly' },
]

const today = new Date().toISOString().split('T')[0]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

writeFileSync(resolve(__dirname, '../dist/sitemap.xml'), sitemap)
console.log(`Sitemap generated with ${pages.length} URLs`)
