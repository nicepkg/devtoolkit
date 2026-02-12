// Prerender all routes to static HTML for SEO
// Runs after `vite build`, launches a local preview server, crawls each route with Puppeteer
import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname, join, extname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '../dist')
const PORT = 4173

const BASE_URL = 'https://devtoolkit-dws.pages.dev'

const ROUTES = [
  '/',
  '/tools/json-formatter',
  '/tools/base64',
  '/tools/cron-parser',
  '/tools/jwt-decoder',
  '/tools/url-encoder',
  '/tools/uuid-generator',
  '/tools/timestamp-converter',
  '/tools/hash-generator',
  '/tools/password-generator',
  '/tools/diff-checker',
  '/tools/regex-tester',
  '/tools/color-converter',
  '/api',
]

// Routes that have JSON-LD structured data (those passing jsonLd to useSeo)
const ROUTES_WITH_JSONLD = new Set(ROUTES.filter((r) => r !== '/api'))

// Simple static file server that handles SPA fallback
function startServer() {
  const fallback = readFileSync(join(DIST, 'index.html'), 'utf-8')
  const MIME = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
    '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon',
  }

  const server = createServer((req, res) => {
    let filePath = join(DIST, req.url === '/' ? '/index.html' : req.url)
    if (!extname(filePath)) filePath = join(filePath, 'index.html')

    try {
      if (existsSync(filePath)) {
        const ext = extname(filePath)
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
        res.end(readFileSync(filePath))
      } else {
        // SPA fallback
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(fallback)
      }
    } catch {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(fallback)
    }
  })

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server))
  })
}

async function prerender() {
  console.log('Starting prerender...')
  const server = await startServer()
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

  for (const route of ROUTES) {
    const page = await browser.newPage()
    const url = `http://localhost:${PORT}${route}`
    console.log(`  Rendering: ${route}`)

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
    // Wait for React to finish rendering
    await page.waitForSelector('#root > *', { timeout: 10000 })
    // Wait for useSeo() hook to update canonical URL to the correct route path
    // Canonical URLs use trailing slash to match Cloudflare Pages behavior
    const canonicalPath = route === '/' ? '/' : `${route}/`
    const expectedCanonical = `${BASE_URL}${canonicalPath}`
    await page.waitForFunction(
      (expected) => {
        const link = document.querySelector('link[rel="canonical"]')
        return link && link.getAttribute('href') === expected
      },
      { timeout: 10000 },
      expectedCanonical,
    )
    // Wait for JSON-LD if this route has structured data
    if (ROUTES_WITH_JSONLD.has(route)) {
      await page.waitForSelector('script[data-seo-jsonld]', { timeout: 10000 })
    }

    let html = await page.content()

    // Remove any prerender-specific artifacts
    // Ensure the root div is preserved for hydration
    html = html.replace(/<script type="module" crossorigin/g, '<script type="module" crossorigin')

    // Write to appropriate path
    if (route === '/') {
      writeFileSync(join(DIST, 'index.html'), html)
    } else {
      const dir = join(DIST, route)
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'index.html'), html)
    }

    await page.close()
  }

  await browser.close()
  server.close()
  console.log(`Prerendered ${ROUTES.length} routes successfully!`)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
