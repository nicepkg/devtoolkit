import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

type UuidVersion = 'v4' | 'v7'

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateUUIDv7(): string {
  const now = Date.now()
  const timeHex = now.toString(16).padStart(12, '0')

  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Timestamp (48 bits) in first 6 bytes
  bytes[0] = parseInt(timeHex.slice(0, 2), 16)
  bytes[1] = parseInt(timeHex.slice(2, 4), 16)
  bytes[2] = parseInt(timeHex.slice(4, 6), 16)
  bytes[3] = parseInt(timeHex.slice(6, 8), 16)
  bytes[4] = parseInt(timeHex.slice(8, 10), 16)
  bytes[5] = parseInt(timeHex.slice(10, 12), 16)

  // Version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  // Variant 10xx
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export default function UuidGenerator() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'UUID Generator',
      description: 'Generate UUID v4 and v7 online. Bulk generate, copy, and download UUIDs instantly.',
      path: '/tools/uuid-generator',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is a UUID?', answer: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is guaranteed to be unique across space and time. UUIDs are used as primary keys in databases, distributed system identifiers, and anywhere a unique ID is needed without a central authority.' },
      { question: 'What is the difference between UUID v4 and v7?', answer: 'UUID v4 is randomly generated with 122 bits of randomness. UUID v7 (RFC 9562, 2024) embeds a Unix timestamp in the first 48 bits, making them time-sortable while retaining 74 bits of randomness. UUID v7 is preferred for database primary keys because it preserves insertion order.' },
      { question: 'Are UUIDs truly unique?', answer: 'Practically yes. UUID v4 has 2^122 possible values — the probability of generating a duplicate is astronomically small (about 1 in 5.3 × 10^36). You would need to generate 1 billion UUIDs per second for 86 years to have a 50% chance of a collision.' },
    ]),
  ], [])

  useSeo({
    title: 'UUID Generator — v4 & v7',
    description: 'Free online UUID generator. Generate UUID v4 (random) and UUID v7 (time-sortable). Bulk generate, copy, and download. No ads, no tracking.',
    path: '/tools/uuid-generator',
    jsonLd,
  })

  const [version, setVersion] = useState<UuidVersion>('v4')
  const [count, setCount] = useState(1)
  const [uuids, setUuids] = useState<string[]>([])
  const [uppercase, setUppercase] = useState(false)
  const [noDashes, setNoDashes] = useState(false)

  const generate = useCallback(() => {
    const fn = version === 'v4' ? generateUUIDv4 : generateUUIDv7
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = fn()
      if (uppercase) uuid = uuid.toUpperCase()
      if (noDashes) uuid = uuid.replace(/-/g, '')
      results.push(uuid)
    }
    setUuids(results)
  }, [version, count, uppercase, noDashes])

  const allText = uuids.join('\n')

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate UUID v4 (random) and v7 (time-sortable) identifiers."
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded border border-border overflow-hidden">
          <button
            onClick={() => setVersion('v4')}
            className={`px-4 py-2 text-sm transition-colors ${
              version === 'v4'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary'
            }`}
          >
            UUID v4
          </button>
          <button
            onClick={() => setVersion('v7')}
            className={`px-4 py-2 text-sm transition-colors ${
              version === 'v7'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary'
            }`}
          >
            UUID v7
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="px-3 py-2 bg-surface-2 border border-border rounded text-sm focus:outline-none focus:border-brand-500/50"
          >
            {[1, 5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded"
          />
          Uppercase
        </label>

        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={noDashes}
            onChange={(e) => setNoDashes(e.target.checked)}
            className="rounded"
          />
          No dashes
        </label>

        <button
          onClick={generate}
          className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded text-sm font-medium transition-colors"
        >
          Generate
        </button>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-text-secondary">
            {uuids.length > 0 ? `${uuids.length} UUID${uuids.length > 1 ? 's' : ''} generated` : 'Click Generate to create UUIDs'}
          </label>
          {uuids.length > 0 && <CopyButton text={allText} />}
        </div>
        <textarea
          value={allText}
          readOnly
          placeholder="Generated UUIDs will appear here..."
          className="w-full h-64 p-4 bg-surface-1 border border-border rounded-lg text-sm font-mono resize-none focus:outline-none placeholder:text-text-muted"
          spellCheck={false}
        />
      </div>

      {uuids.length > 0 && version === 'v7' && (
        <div className="mt-4 text-sm text-text-muted">
          Embedded timestamp: {new Date(parseInt(uuids[0].replace(/-/g, '').slice(0, 12), 16)).toISOString()}
        </div>
      )}

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is a UUID?</h2>
        <p>
          A UUID (Universally Unique Identifier) is a 128-bit identifier standardized by RFC 9562.
          UUIDs are used as primary keys in databases, distributed system identifiers, API keys,
          session tokens, and anywhere a globally unique ID is needed without central coordination.
        </p>
        <h3 className="font-semibold text-text-primary">UUID v4 vs UUID v7</h3>
        <p>
          <strong>UUID v4</strong> is randomly generated with 122 bits of randomness. It's the most
          widely used version and works great when ordering doesn't matter.
        </p>
        <p>
          <strong>UUID v7</strong> (RFC 9562, 2024) embeds a Unix millisecond timestamp in the first
          48 bits. This makes UUIDs time-sortable — ideal for database primary keys because they
          preserve insertion order, improving B-tree index performance.
        </p>
        <h3 className="font-semibold text-text-primary">Common Use Cases</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Database primary keys (PostgreSQL, MySQL, MongoDB)</li>
          <li>Distributed system identifiers</li>
          <li>API request and session tracking</li>
          <li>File naming and deduplication</li>
          <li>Message queue identifiers (Kafka, RabbitMQ)</li>
        </ul>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>UUID v4 (random) and v7 (time-sortable) support</li>
          <li>Bulk generation — up to 100 UUIDs at once</li>
          <li>Options for uppercase and dash-free formats</li>
          <li>Timestamp extraction from UUID v7</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="uuid-generator" />
    </ToolLayout>
  )
}
