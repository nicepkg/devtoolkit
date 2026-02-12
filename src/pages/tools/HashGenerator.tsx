import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

// Simple MD5 implementation (not for security, just for tool use)
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  function binlMD5(x: number[], len: number) {
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
    for (let i = 0; i < x.length; i += 16) {
      const olda = a, oldb = b, oldc = c, oldd = d
      a = md5ff(a, b, c, d, x[i], 7, -680876936); d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819); b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897); d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341); b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416); d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063); b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682); d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290); b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510); d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713); b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691); d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335); b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438); d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961); b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467); d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473); b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558); d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562); b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060); d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632); b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174); d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979); b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487); d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520); b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844); d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905); b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571); d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523); b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359); d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380); b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070); d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259); b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  function rstrMD5(s: string) {
    const input: number[] = []
    for (let i = 0; i < s.length * 8; i += 8) {
      input[i >> 5] |= (s.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    const output = binlMD5(input, s.length * 8)
    let result = ''
    for (let i = 0; i < output.length * 32; i += 8) {
      result += String.fromCharCode((output[i >> 5] >>> (i % 32)) & 0xff)
    }
    return result
  }

  function hexMD5(s: string) {
    const hex = '0123456789abcdef'
    const raw = rstrMD5(unescape(encodeURIComponent(s)))
    let result = ''
    for (let i = 0; i < raw.length; i++) {
      const x = raw.charCodeAt(i)
      result += hex.charAt((x >>> 4) & 0x0f) + hex.charAt(x & 0x0f)
    }
    return result
  }

  return hexMD5(input)
}

async function hashWithWebCrypto(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const ALGORITHMS: { name: HashAlgorithm; webCrypto: string; bits: number }[] = [
  { name: 'MD5', webCrypto: '', bits: 128 },
  { name: 'SHA-1', webCrypto: 'SHA-1', bits: 160 },
  { name: 'SHA-256', webCrypto: 'SHA-256', bits: 256 },
  { name: 'SHA-384', webCrypto: 'SHA-384', bits: 384 },
  { name: 'SHA-512', webCrypto: 'SHA-512', bits: 512 },
]

export default function HashGenerator() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes online. Fast, free, and private.',
      path: '/tools/hash-generator',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is a hash function?', answer: 'A cryptographic hash function takes an input (or message) and returns a fixed-size string of bytes. The output (hash) is unique to each unique input — even a small change in input produces a completely different hash. Common algorithms include MD5, SHA-1, and SHA-256.' },
      { question: 'Is MD5 still safe to use?', answer: 'MD5 is NOT safe for security purposes (passwords, digital signatures) because collisions have been found. However, MD5 is still widely used for non-security purposes like file checksums, cache keys, and data deduplication where collision resistance is not critical.' },
      { question: 'Which hash algorithm should I use?', answer: 'For security (passwords, signatures): use SHA-256 or SHA-512. For checksums and data integrity: SHA-256 is the standard. For passwords specifically: use bcrypt, scrypt, or Argon2 instead of plain hashing. MD5 and SHA-1 are deprecated for security use.' },
    ]),
  ], [])

  useSeo({
    title: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
    description: 'Free online hash generator. Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes instantly. Compare hashes, verify file integrity. No ads, no tracking.',
    path: '/tools/hash-generator',
    jsonLd,
  })

  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [compareHash, setCompareHash] = useState('')
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm>('SHA-256')
  const [computing, setComputing] = useState(false)

  const computeAllHashes = useCallback(async (text: string) => {
    if (!text) {
      setHashes({})
      return
    }
    setComputing(true)
    const results: Record<string, string> = {}
    results['MD5'] = md5(text)
    for (const algo of ALGORITHMS) {
      if (algo.webCrypto) {
        results[algo.name] = await hashWithWebCrypto(text, algo.webCrypto)
      }
    }
    setHashes(results)
    setComputing(false)
  }, [])

  const handleInputChange = (value: string) => {
    setInput(value)
    computeAllHashes(value)
  }

  const compareMatch = compareHash.trim()
    ? Object.entries(hashes).find(([, hash]) => hash.toLowerCase() === compareHash.trim().toLowerCase())
    : null

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes from text."
    >
      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-text-secondary">Input Text</label>
          <button
            onClick={() => { setInput(''); setHashes({}); setCompareHash('') }}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
          spellCheck={false}
        />
        {input && (
          <div className="text-xs text-text-muted mt-1">{new Blob([input]).size} bytes</div>
        )}
      </div>

      {/* Hash results */}
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-2 mb-6">
          {ALGORITHMS.map((algo) => (
            <div
              key={algo.name}
              className={`flex items-center gap-3 p-3 bg-surface-1 border rounded-lg ${
                selectedAlgo === algo.name ? 'border-brand-500/50' : 'border-border'
              }`}
              onClick={() => setSelectedAlgo(algo.name)}
            >
              <span className={`text-xs font-mono w-16 shrink-0 ${
                algo.name === 'MD5' || algo.name === 'SHA-1'
                  ? 'text-yellow-400'
                  : 'text-brand-400'
              }`}>
                {algo.name}
              </span>
              <span className="text-sm font-mono text-text-primary break-all flex-1">
                {hashes[algo.name] || (computing ? '...' : '')}
              </span>
              {hashes[algo.name] && <CopyButton text={hashes[algo.name]} />}
            </div>
          ))}
        </div>
      )}

      {/* Hash comparison */}
      <div className="mb-4">
        <label className="text-sm text-text-secondary mb-2 block">Compare Hash (optional)</label>
        <input
          type="text"
          value={compareHash}
          onChange={(e) => setCompareHash(e.target.value)}
          placeholder="Paste a hash to compare against..."
          className="w-full px-4 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
          spellCheck={false}
        />
        {compareHash.trim() && Object.keys(hashes).length > 0 && (
          <div className={`mt-2 px-3 py-2 rounded text-sm ${
            compareMatch
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {compareMatch
              ? `Match found: ${compareMatch[0]}`
              : 'No match found with any algorithm'}
          </div>
        )}
      </div>

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is a Hash Function?</h2>
        <p>
          A cryptographic hash function takes any input and produces a fixed-size output (the hash
          or digest). The same input always produces the same hash, but even a tiny change in the
          input creates a completely different output. This property is called the avalanche effect.
        </p>
        <h3 className="font-semibold text-text-primary">Algorithm Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4">Algorithm</th>
                <th className="py-2 pr-4">Output Size</th>
                <th className="py-2 pr-4">Security</th>
                <th className="py-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-yellow-400">MD5</td>
                <td className="py-2 pr-4">128 bits</td>
                <td className="py-2 pr-4 text-red-400">Broken</td>
                <td className="py-2">Checksums, cache keys only</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-yellow-400">SHA-1</td>
                <td className="py-2 pr-4">160 bits</td>
                <td className="py-2 pr-4 text-yellow-400">Deprecated</td>
                <td className="py-2">Legacy systems only</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-brand-400">SHA-256</td>
                <td className="py-2 pr-4">256 bits</td>
                <td className="py-2 pr-4 text-green-400">Secure</td>
                <td className="py-2">Digital signatures, SSL, blockchain</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-brand-400">SHA-384</td>
                <td className="py-2 pr-4">384 bits</td>
                <td className="py-2 pr-4 text-green-400">Secure</td>
                <td className="py-2">Government, high-security systems</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-brand-400">SHA-512</td>
                <td className="py-2 pr-4">512 bits</td>
                <td className="py-2 pr-4 text-green-400">Secure</td>
                <td className="py-2">Maximum security requirements</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="font-semibold text-text-primary">Common Use Cases</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Verifying file integrity after downloads</li>
          <li>Generating checksums for data deduplication</li>
          <li>Creating cache keys for APIs and databases</li>
          <li>Comparing file contents without reading entire files</li>
          <li>Git commit hashes (SHA-1, migrating to SHA-256)</li>
        </ul>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>5 algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512</li>
          <li>Real-time hashing as you type</li>
          <li>Hash comparison to verify integrity</li>
          <li>Security indicators for each algorithm</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="hash-generator" />
    </ToolLayout>
  )
}
