import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import { useSeo } from '@/hooks/useSeo'

export default function UrlEncoder() {
  useSeo({
    title: 'URL Encoder/Decoder',
    description: 'Free online URL encoder and decoder. Encode and decode URL components and full URIs. No ads, no tracking.',
    path: '/tools/url-encoder',
  })
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component')
  const [error, setError] = useState('')

  const process = (text: string, m: 'encode' | 'decode', et: 'component' | 'full') => {
    if (!text.trim()) {
      setOutput('')
      setError('')
      return
    }
    try {
      if (m === 'encode') {
        setOutput(et === 'component' ? encodeURIComponent(text) : encodeURI(text))
      } else {
        setOutput(et === 'component' ? decodeURIComponent(text) : decodeURI(text))
      }
      setError('')
    } catch {
      setError(m === 'decode' ? 'Invalid encoded string' : 'Encoding failed')
      setOutput('')
    }
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    process(value, mode, encodeType)
  }

  const handleModeChange = (m: 'encode' | 'decode') => {
    setMode(m)
    process(input, m, encodeType)
  }

  const handleEncodeTypeChange = (et: 'component' | 'full') => {
    setEncodeType(et)
    process(input, mode, et)
  }

  const swap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setInput(output)
    setMode(newMode)
    process(output, newMode, encodeType)
  }

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode and decode URL components and full URIs."
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded border border-border overflow-hidden">
          <button
            onClick={() => handleModeChange('encode')}
            className={`px-4 py-2 text-sm transition-colors ${
              mode === 'encode'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`px-4 py-2 text-sm transition-colors ${
              mode === 'decode'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary'
            }`}
          >
            Decode
          </button>
        </div>

        <div className="flex rounded border border-border overflow-hidden">
          <button
            onClick={() => handleEncodeTypeChange('component')}
            className={`px-3 py-2 text-xs transition-colors ${
              encodeType === 'component'
                ? 'bg-surface-3 text-text-primary'
                : 'bg-surface-2 text-text-muted hover:text-text-secondary'
            }`}
          >
            Component
          </button>
          <button
            onClick={() => handleEncodeTypeChange('full')}
            className={`px-3 py-2 text-xs transition-colors ${
              encodeType === 'full'
                ? 'bg-surface-3 text-text-primary'
                : 'bg-surface-2 text-text-muted hover:text-text-secondary'
            }`}
          >
            Full URI
          </button>
        </div>

        <button
          onClick={swap}
          className="px-3 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm transition-colors"
        >
          ⇄ Swap
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">
              {mode === 'encode' ? 'Text / URL' : 'Encoded String'}
            </label>
            <button
              onClick={() => { setInput(''); setOutput(''); setError('') }}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter encoded string to decode...'}
            className="w-full h-64 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">
              {mode === 'encode' ? 'Encoded' : 'Decoded'}
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full h-64 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-text-muted">
        <strong>Component</strong> encodes all special characters (for query params).
        <strong className="ml-2">Full URI</strong> preserves :, /, ?, #, &amp; (for complete URLs).
      </div>

      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is URL Encoding?</h2>
        <p>
          URL encoding (percent-encoding) replaces unsafe ASCII characters with a "%" followed
          by two hexadecimal digits. It's essential for passing special characters in URLs,
          query parameters, and form data.
        </p>
        <h3 className="font-semibold text-text-primary">When to Use</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Component:</strong> Use when encoding query parameter values (encodeURIComponent)</li>
          <li><strong>Full URI:</strong> Use when encoding a complete URL (encodeURI)</li>
          <li>Handling special characters in API requests</li>
          <li>Building URLs with user-provided input</li>
        </ul>
      </div>
    </ToolLayout>
  )
}
