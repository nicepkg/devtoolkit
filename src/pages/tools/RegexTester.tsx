import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

interface MatchResult {
  match: string
  index: number
  groups: Record<string, string> | null
}

const PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { label: 'URL', pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+' },
  { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { label: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' },
]

export default function RegexTester() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Regex Tester',
      description: 'Test and debug regular expressions online with real-time matching, syntax highlighting, and match details.',
      path: '/tools/regex-tester',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is a regular expression?', answer: 'A regular expression (regex) is a pattern used to match character combinations in text. Regex is used in programming for search, validation, and text manipulation. Common uses include email validation, URL parsing, log analysis, and data extraction.' },
      { question: 'What do regex flags mean?', answer: 'g (global) finds all matches instead of stopping at the first. i (case-insensitive) ignores upper/lowercase differences. m (multiline) makes ^ and $ match line starts/ends instead of string starts/ends. s (dotAll) makes . match newline characters too.' },
      { question: 'How do I test a regex online?', answer: 'Enter your regex pattern in the pattern field, paste your test string in the text area, and see matches highlighted in real-time. Use flags (g, i, m, s) to control matching behavior. Click preset patterns for common use cases like emails, URLs, and IP addresses.' },
    ]),
  ], [])

  useSeo({
    title: 'Regex Tester — Online Regular Expression Tester',
    description: 'Free online regex tester. Test and debug regular expressions with real-time matching, flags support (g, i, m, s), preset patterns, and match details. No ads, no tracking.',
    path: '/tools/regex-tester',
    jsonLd,
  })

  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [error, setError] = useState<string | null>(null)

  const toggleFlag = useCallback((flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag)
  }, [])

  const matches: MatchResult[] = useMemo(() => {
    if (!pattern || !testString) {
      setError(null)
      return []
    }

    try {
      const regex = new RegExp(pattern, flags)
      setError(null)

      const results: MatchResult[] = []
      if (flags.includes('g')) {
        let m
        while ((m = regex.exec(testString)) !== null) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.groups ? { ...m.groups } : null,
          })
          if (m[0].length === 0) {
            regex.lastIndex++
          }
        }
      } else {
        const m = regex.exec(testString)
        if (m) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.groups ? { ...m.groups } : null,
          })
        }
      }
      return results
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex')
      return []
    }
  }, [pattern, flags, testString])

  // Build highlighted text
  const highlightedHtml = useMemo(() => {
    if (!pattern || !testString || matches.length === 0) return null

    const parts: { text: string; isMatch: boolean; matchIndex: number }[] = []
    let lastEnd = 0
    matches.forEach((m, i) => {
      if (m.index > lastEnd) {
        parts.push({ text: testString.slice(lastEnd, m.index), isMatch: false, matchIndex: -1 })
      }
      parts.push({ text: m.match, isMatch: true, matchIndex: i })
      lastEnd = m.index + m.match.length
    })
    if (lastEnd < testString.length) {
      parts.push({ text: testString.slice(lastEnd), isMatch: false, matchIndex: -1 })
    }
    return parts
  }, [pattern, testString, matches])

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test and debug regular expressions with real-time matching."
    >
      {/* Pattern input */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-text-secondary font-medium">Pattern</label>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 flex items-center bg-surface-1 border border-border rounded-lg overflow-hidden focus-within:border-brand-500/50">
            <span className="pl-3 text-text-muted font-mono text-sm">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 px-1 py-3 bg-transparent text-sm font-mono focus:outline-none"
              spellCheck={false}
            />
            <span className="pr-3 text-text-muted font-mono text-sm">/{flags}</span>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-text-secondary">Flags:</span>
        {[
          { flag: 'g', label: 'Global', desc: 'Find all matches' },
          { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
          { flag: 'm', label: 'Multiline', desc: '^ and $ match lines' },
          { flag: 's', label: 'DotAll', desc: '. matches newline' },
        ].map(({ flag, label }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
              flags.includes(flag)
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-surface-2 text-text-secondary border-border hover:border-brand-500/40'
            }`}
            title={label}
          >
            {flag}
          </button>
        ))}
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-text-secondary">Presets:</span>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setPattern(p.pattern)}
            className="px-3 py-1 text-xs rounded border border-border bg-surface-2 text-text-secondary hover:border-brand-500/40 hover:text-text-primary transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Test string */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-text-secondary font-medium">Test String</label>
          {testString && <CopyButton text={testString} />}
        </div>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          placeholder="Enter test string to match against..."
          className="w-full h-40 p-4 bg-surface-1 border border-border rounded-lg text-sm font-mono resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
          spellCheck={false}
        />
      </div>

      {/* Highlighted result */}
      {highlightedHtml && (
        <div className="mb-4">
          <label className="text-sm text-text-secondary font-medium mb-2 block">Highlighted Matches</label>
          <div className="p-4 bg-surface-1 border border-border rounded-lg text-sm font-mono whitespace-pre-wrap break-all">
            {highlightedHtml.map((part, i) =>
              part.isMatch ? (
                <mark
                  key={i}
                  className="bg-brand-500/30 text-brand-300 rounded px-0.5"
                  title={`Match #${part.matchIndex + 1}`}
                >
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Match details */}
      <div className="mb-4">
        <label className="text-sm text-text-secondary font-medium mb-2 block">
          {matches.length > 0
            ? `${matches.length} match${matches.length > 1 ? 'es' : ''} found`
            : pattern && testString
              ? 'No matches'
              : 'Enter a pattern and test string'}
        </label>
        {matches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-surface-2 text-text-secondary">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">Match</th>
                  <th className="px-3 py-2 text-left font-medium">Index</th>
                  <th className="px-3 py-2 text-left font-medium">Length</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2 text-text-muted">{i + 1}</td>
                    <td className="px-3 py-2 font-mono text-brand-300">{m.match || '(empty)'}</td>
                    <td className="px-3 py-2 text-text-secondary">{m.index}</td>
                    <td className="px-3 py-2 text-text-secondary">{m.match.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What are Regular Expressions?</h2>
        <p>
          Regular expressions (regex) are powerful patterns used to match, search, and replace text. They are
          supported in virtually every programming language — JavaScript, Python, Java, Go, Rust, C#, PHP, Ruby,
          and more. Regex is essential for input validation, log parsing, data extraction, and text transformation.
        </p>
        <h3 className="font-semibold text-text-primary">Common Regex Patterns</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="text-brand-300">\\d</code> — any digit (0-9)</li>
          <li><code className="text-brand-300">\\w</code> — any word character (a-z, A-Z, 0-9, _)</li>
          <li><code className="text-brand-300">\\s</code> — any whitespace (space, tab, newline)</li>
          <li><code className="text-brand-300">[abc]</code> — character class: a, b, or c</li>
          <li><code className="text-brand-300">a|b</code> — alternation: a or b</li>
          <li><code className="text-brand-300">^</code> / <code className="text-brand-300">$</code> — start / end of string</li>
          <li><code className="text-brand-300">*</code> / <code className="text-brand-300">+</code> / <code className="text-brand-300">?</code> — zero or more / one or more / optional</li>
          <li><code className="text-brand-300">{'\\{n,m\\}'}</code> — between n and m repetitions</li>
          <li><code className="text-brand-300">(?:...)</code> — non-capturing group</li>
          <li><code className="text-brand-300">{'(?<name>...)'}</code> — named capturing group</li>
        </ul>
        <h3 className="font-semibold text-text-primary">Regex Flags Explained</h3>
        <p>
          <strong>g (global)</strong> — find all matches, not just the first.
          <strong> i (case-insensitive)</strong> — ignore case when matching.
          <strong> m (multiline)</strong> — <code className="text-brand-300">^</code> and <code className="text-brand-300">$</code> match the start/end of each line.
          <strong> s (dotAll)</strong> — makes <code className="text-brand-300">.</code> match newlines too.
        </p>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Real-time matching as you type</li>
          <li>Syntax highlighting for matched text</li>
          <li>Match details table with index and length</li>
          <li>Flag toggles (g, i, m, s)</li>
          <li>Preset patterns for common use cases</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="regex-tester" />
    </ToolLayout>
  )
}
