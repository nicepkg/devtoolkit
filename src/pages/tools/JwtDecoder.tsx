import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import { useSeo } from '@/hooks/useSeo'

interface JwtParts {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  headerRaw: string
  payloadRaw: string
}

function decodeJwt(token: string): JwtParts | { error: string } {
  const trimmed = token.trim()
  if (!trimmed) return { error: 'Enter a JWT token' }

  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return { error: `Expected 3 parts (header.payload.signature), got ${parts.length}` }
  }

  try {
    const headerRaw = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))
    const payloadRaw = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const header = JSON.parse(headerRaw)
    const payload = JSON.parse(payloadRaw)
    return { header, payload, signature: parts[2], headerRaw, payloadRaw }
  } catch {
    return { error: 'Failed to decode JWT. Check if the token is valid.' }
  }
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== 'number') return null
  // JWT timestamps are in seconds
  if (value > 1e9 && value < 2e10) {
    return new Date(value * 1000).toISOString()
  }
  return null
}

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzkyMTQ0MDAsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function JsonBlock({ title, data, color }: { title: string; data: Record<string, unknown>; color: string }) {
  const formatted = JSON.stringify(data, null, 2)
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className={`px-4 py-2 flex items-center justify-between ${color}`}>
        <span className="text-sm font-medium">{title}</span>
        <CopyButton text={formatted} />
      </div>
      <div className="p-4 bg-surface-1 text-sm font-mono space-y-1">
        {Object.entries(data).map(([key, value]) => {
          const timestamp = formatTimestamp(value)
          return (
            <div key={key} className="flex flex-wrap gap-2">
              <span className="text-brand-400">"{key}"</span>
              <span className="text-text-muted">:</span>
              <span className="text-text-primary">
                {typeof value === 'string' ? `"${value}"` : String(value)}
              </span>
              {timestamp && (
                <span className="text-text-muted text-xs">
                  → {timestamp}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function JwtDecoder() {
  useSeo({
    title: 'JWT Decoder',
    description: 'Free online JWT decoder. Inspect JSON Web Token header, payload, claims, and expiration. No ads, no tracking.',
    path: '/tools/jwt-decoder',
  })
  const [input, setInput] = useState('')
  const [result, setResult] = useState<JwtParts | { error: string }>({ error: 'Enter a JWT token' })

  const handleChange = useCallback((value: string) => {
    setInput(value)
    setResult(decodeJwt(value))
  }, [])

  const loadSample = () => handleChange(SAMPLE_JWT)

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens — header, payload, and signature."
    >
      <div className="mb-4 flex gap-3">
        <button onClick={loadSample} className="px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm text-text-secondary transition-colors">
          Load Sample
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-text-secondary">JWT Token</label>
          <button
            onClick={() => { setInput(''); setResult({ error: 'Enter a JWT token' }) }}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste your JWT token here (eyJhbGci...)"
          className="w-full h-28 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted break-all"
          spellCheck={false}
        />
      </div>

      {'error' in result ? (
        input.trim() ? (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {result.error}
          </div>
        ) : null
      ) : (
        <div className="space-y-4">
          <JsonBlock title="Header" data={result.header} color="bg-brand-500/10" />
          <JsonBlock title="Payload" data={result.payload} color="bg-green-500/10" />
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2 bg-red-500/10 flex items-center justify-between">
              <span className="text-sm font-medium">Signature</span>
              <CopyButton text={result.signature} />
            </div>
            <div className="p-4 bg-surface-1">
              <code className="text-sm text-text-secondary break-all">{result.signature}</code>
            </div>
          </div>

          {/* Token validation info */}
          {'exp' in result.payload && typeof result.payload.exp === 'number' && (
            <div className={`px-4 py-2 rounded text-sm ${
              result.payload.exp * 1000 < Date.now()
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-green-500/10 border border-green-500/30 text-green-400'
            }`}>
              {result.payload.exp * 1000 < Date.now()
                ? `Token expired on ${new Date(result.payload.exp * 1000).toISOString()}`
                : `Token expires on ${new Date(result.payload.exp * 1000).toISOString()}`
              }
            </div>
          )}
        </div>
      )}

      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is a JSON Web Token (JWT)?</h2>
        <p>
          JWT is an open standard (RFC 7519) for securely transmitting information between parties
          as a JSON object. It consists of three parts: Header, Payload, and Signature, separated by dots.
        </p>
        <h3 className="font-semibold text-text-primary">Common JWT Claims</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="bg-surface-2 px-1 rounded">iss</code> — Issuer</li>
          <li><code className="bg-surface-2 px-1 rounded">sub</code> — Subject</li>
          <li><code className="bg-surface-2 px-1 rounded">exp</code> — Expiration time</li>
          <li><code className="bg-surface-2 px-1 rounded">iat</code> — Issued at</li>
          <li><code className="bg-surface-2 px-1 rounded">aud</code> — Audience</li>
        </ul>
        <p>
          <strong>Note:</strong> This tool only decodes JWTs — it does not verify signatures.
          Never trust a JWT without server-side signature verification.
        </p>
      </div>
    </ToolLayout>
  )
}
