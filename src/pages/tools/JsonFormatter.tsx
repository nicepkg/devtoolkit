import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import { useSeo } from '@/hooks/useSeo'

export default function JsonFormatter() {
  useSeo({
    title: 'JSON Formatter & Validator',
    description: 'Free online JSON formatter, validator, and minifier. Format, beautify, and validate JSON data with customizable indentation. No ads, no tracking.',
    path: '/tools/json-formatter',
  })
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [input, indent])

  const minify = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }, [input])

  const handleInputChange = (value: string) => {
    setInput(value)
    if (!value.trim()) {
      setOutput('')
      setError('')
      return
    }
    try {
      const parsed = JSON.parse(value)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const loadSample = () => {
    const sample = JSON.stringify({
      name: "DevToolkit",
      version: "1.0.0",
      features: ["JSON Formatter", "Base64", "JWT Decoder"],
      config: { theme: "dark", indent: 2 },
      active: true
    })
    handleInputChange(sample)
  }

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, and minify JSON data instantly."
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button onClick={format} className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded text-sm font-medium transition-colors">
          Format
        </button>
        <button onClick={minify} className="px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm transition-colors">
          Minify
        </button>
        <button onClick={loadSample} className="px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm text-text-secondary transition-colors">
          Sample
        </button>
        <label className="flex items-center gap-2 text-sm text-text-secondary ml-auto">
          Indent:
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="bg-surface-2 border border-border rounded px-2 py-1 text-sm text-text-primary"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Editor panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">Input</label>
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
            placeholder='Paste your JSON here...'
            className="w-full h-80 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full h-80 p-4 bg-surface-1 border border-border rounded-lg text-sm resize-none focus:outline-none placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is JSON Formatter?</h2>
        <p>
          A JSON formatter (also known as JSON beautifier or pretty printer) takes minified or
          compact JSON data and formats it with proper indentation and line breaks, making it
          easy to read and debug.
        </p>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Real-time JSON validation as you type</li>
          <li>Customizable indentation (2 spaces, 4 spaces, or tabs)</li>
          <li>JSON minification for production use</li>
          <li>One-click copy to clipboard</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>
    </ToolLayout>
  )
}
