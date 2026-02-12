import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

export default function Base64() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Base64 Encoder/Decoder',
      description: 'Free online Base64 encoder and decoder with UTF-8 support.',
      path: '/tools/base64',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is Base64 encoding?', answer: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is commonly used to embed images in HTML/CSS, encode email attachments, and transmit binary data over text-based protocols.' },
      { question: 'Is Base64 encoding reversible?', answer: 'Yes, Base64 encoding is fully reversible. You can encode text to Base64 and decode it back to the original text without any data loss.' },
      { question: 'Does this tool support UTF-8?', answer: 'Yes, this Base64 encoder/decoder fully supports UTF-8 characters including international characters, emojis, and multi-byte sequences.' },
    ]),
  ], [])

  useSeo({
    title: 'Base64 Encoder/Decoder',
    description: 'Free online Base64 encoder and decoder with UTF-8 support. Convert text to Base64 and back instantly. No ads, no tracking.',
    path: '/tools/base64',
    jsonLd,
  })
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const process = (text: string, m: 'encode' | 'decode') => {
    if (!text.trim()) {
      setOutput('')
      setError('')
      return
    }
    try {
      if (m === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))))
      } else {
        setOutput(decodeURIComponent(escape(atob(text.trim()))))
      }
      setError('')
    } catch {
      setError(m === 'decode' ? 'Invalid Base64 string' : 'Encoding failed')
      setOutput('')
    }
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    process(value, mode)
  }

  const handleModeChange = (m: 'encode' | 'decode') => {
    setMode(m)
    process(input, m)
  }

  const swap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode'
    setInput(output)
    setMode(newMode)
    process(output, newMode)
  }

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 to text. Supports UTF-8."
    >
      <div className="flex items-center gap-3 mb-4">
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
        <button
          onClick={swap}
          className="px-3 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm transition-colors"
          title="Swap input and output"
        >
          Swap
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
              {mode === 'encode' ? 'Text' : 'Base64'}
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
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="w-full h-64 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">
              {mode === 'encode' ? 'Base64' : 'Text'}
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

      {input && (
        <div className="mt-4 flex gap-6 text-sm text-text-muted">
          <span>Input: {new Blob([input]).size} bytes</span>
          {output && <span>Output: {new Blob([output]).size} bytes</span>}
          {mode === 'encode' && output && (
            <span>Size increase: {((new Blob([output]).size / new Blob([input]).size - 1) * 100).toFixed(1)}%</span>
          )}
        </div>
      )}

      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is Base64 Encoding?</h2>
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII
          string format. It's commonly used to embed images in HTML/CSS, encode email attachments
          (MIME), and transmit binary data over text-based protocols.
        </p>
        <h3 className="font-semibold text-text-primary">Common Use Cases</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Embedding images in HTML/CSS using data URIs</li>
          <li>Encoding binary data for JSON APIs</li>
          <li>Email attachments (MIME encoding)</li>
          <li>Storing binary data in text-based formats like XML</li>
          <li>Basic authentication headers in HTTP requests</li>
        </ul>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Full UTF-8 support for international characters</li>
          <li>Real-time encoding/decoding as you type</li>
          <li>Swap button to quickly reverse input and output</li>
          <li>Byte size comparison between input and output</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="base64" />
    </ToolLayout>
  )
}
