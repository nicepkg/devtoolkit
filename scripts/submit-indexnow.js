// Submit all URLs to IndexNow (Bing, Yandex, and other participating search engines)
// IndexNow requires: (1) a key file at /<key>.txt and (2) a POST to the API

const BASE_URL = 'https://devtoolkit-dws.pages.dev'
const KEY = 'dc4dc43c867848039f77fc736891655f'

const urls = [
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
].map(path => `${BASE_URL}${path}`)

async function submitToIndexNow(engine) {
  const endpoint = `https://${engine}/indexnow`
  const body = {
    host: 'devtoolkit-dws.pages.dev',
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList: urls,
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })
    console.log(`${engine}: ${res.status} ${res.statusText}`)
    if (res.status >= 400) {
      const text = await res.text()
      console.log(`  Response: ${text.slice(0, 200)}`)
    }
  } catch (err) {
    console.error(`${engine}: Error — ${err.message}`)
  }
}

async function main() {
  console.log(`Submitting ${urls.length} URLs to IndexNow...`)
  console.log('URLs:', urls.join('\n  '))
  console.log()

  // Submit to all IndexNow-participating engines
  await Promise.all([
    submitToIndexNow('api.indexnow.org'),
    submitToIndexNow('www.bing.com'),
    submitToIndexNow('yandex.com'),
  ])

  console.log('\nDone! URLs submitted to Bing, Yandex, and other IndexNow participants.')
}

main()
