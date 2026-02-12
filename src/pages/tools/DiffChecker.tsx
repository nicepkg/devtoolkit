import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

interface DiffLine {
  type: 'equal' | 'add' | 'remove'
  lineOld?: number
  lineNew?: number
  content: string
}

// Simple line-based diff using Longest Common Subsequence
function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const m = oldLines.length
  const n = newLines.length

  // LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = []
  let i = m, j = n
  const stack: DiffLine[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: 'equal', lineOld: i, lineNew: j, content: oldLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'add', lineNew: j, content: newLines[j - 1] })
      j--
    } else {
      stack.push({ type: 'remove', lineOld: i, content: oldLines[i - 1] })
      i--
    }
  }

  // Reverse since we built it backwards
  for (let k = stack.length - 1; k >= 0; k--) {
    result.push(stack[k])
  }

  return result
}

function diffStats(diff: DiffLine[]): { added: number; removed: number; unchanged: number } {
  let added = 0, removed = 0, unchanged = 0
  for (const line of diff) {
    if (line.type === 'add') added++
    else if (line.type === 'remove') removed++
    else unchanged++
  }
  return { added, removed, unchanged }
}

export default function DiffChecker() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Text Diff Checker',
      description: 'Compare two texts and find differences. Online diff tool with syntax highlighting.',
      path: '/tools/diff-checker',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is a diff?', answer: 'A diff (short for difference) is a comparison between two texts that shows which lines were added, removed, or changed. Diffs are fundamental to version control systems like Git, code review tools, and text comparison utilities.' },
      { question: 'How does the diff algorithm work?', answer: 'This tool uses the Longest Common Subsequence (LCS) algorithm to find the minimal set of changes between two texts. It compares texts line by line and identifies insertions (green), deletions (red), and unchanged lines. This is the same fundamental approach used by Git and other version control systems.' },
      { question: 'Can I compare code with this tool?', answer: 'Yes! This diff checker works with any text including source code, configuration files, JSON, XML, Markdown, and plain text. It compares line by line, making it ideal for reviewing code changes, comparing config files, or checking text modifications.' },
    ]),
  ], [])

  useSeo({
    title: 'Text Diff Checker — Compare Two Texts',
    description: 'Free online diff checker. Compare two texts side by side and find differences. Line-by-line comparison with additions, deletions, and statistics. No ads, no tracking.',
    path: '/tools/diff-checker',
    jsonLd,
  })

  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [showDiff, setShowDiff] = useState(false)

  const diff = useMemo(() => {
    if (!showDiff) return []
    return computeDiff(oldText, newText)
  }, [oldText, newText, showDiff])

  const stats = useMemo(() => diffStats(diff), [diff])

  const handleCompare = useCallback(() => {
    setShowDiff(true)
  }, [])

  const handleClear = useCallback(() => {
    setOldText('')
    setNewText('')
    setShowDiff(false)
  }, [])

  const handleSwap = useCallback(() => {
    setOldText(newText)
    setNewText(oldText)
    if (showDiff) setShowDiff(true)
  }, [oldText, newText, showDiff])

  const lineColor = (type: DiffLine['type']) => {
    if (type === 'add') return 'bg-green-500/10 text-green-300'
    if (type === 'remove') return 'bg-red-500/10 text-red-300'
    return ''
  }

  const linePrefix = (type: DiffLine['type']) => {
    if (type === 'add') return '+'
    if (type === 'remove') return '-'
    return ' '
  }

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts and find the differences line by line."
    >
      {/* Input panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">Original Text</label>
            {oldText && (
              <span className="text-xs text-text-muted">{oldText.split('\n').length} lines</span>
            )}
          </div>
          <textarea
            value={oldText}
            onChange={(e) => { setOldText(e.target.value); setShowDiff(false) }}
            placeholder="Paste original text here..."
            className="w-full h-64 p-4 bg-surface-1 border border-border rounded-lg text-sm font-mono resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">Modified Text</label>
            {newText && (
              <span className="text-xs text-text-muted">{newText.split('\n').length} lines</span>
            )}
          </div>
          <textarea
            value={newText}
            onChange={(e) => { setNewText(e.target.value); setShowDiff(false) }}
            placeholder="Paste modified text here..."
            className="w-full h-64 p-4 bg-surface-1 border border-border rounded-lg text-sm font-mono resize-none focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={handleCompare}
          disabled={!oldText && !newText}
          className="px-5 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
        >
          Compare
        </button>
        <button
          onClick={handleSwap}
          disabled={!oldText && !newText}
          className="px-4 py-2 bg-surface-2 hover:bg-surface-3 disabled:opacity-40 disabled:cursor-not-allowed border border-border rounded text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Clear
        </button>

        {showDiff && diff.length > 0 && (
          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="text-green-400">+{stats.added} added</span>
            <span className="text-red-400">-{stats.removed} removed</span>
            <span className="text-text-muted">{stats.unchanged} unchanged</span>
          </div>
        )}
      </div>

      {/* Diff output */}
      {showDiff && (
        <div className="border border-border rounded-lg overflow-hidden">
          {diff.length === 0 && (oldText || newText) && (
            <div className="p-8 text-center text-text-muted text-sm">
              Both texts are identical — no differences found.
            </div>
          )}
          {diff.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {diff.map((line, idx) => (
                    <tr key={idx} className={lineColor(line.type)}>
                      <td className="px-2 py-0.5 text-right text-text-muted select-none w-12 border-r border-border/30">
                        {line.lineOld ?? ''}
                      </td>
                      <td className="px-2 py-0.5 text-right text-text-muted select-none w-12 border-r border-border/30">
                        {line.lineNew ?? ''}
                      </td>
                      <td className="px-2 py-0.5 select-none w-6 text-center">
                        <span className={line.type === 'add' ? 'text-green-400' : line.type === 'remove' ? 'text-red-400' : 'text-text-muted'}>
                          {linePrefix(line.type)}
                        </span>
                      </td>
                      <td className="px-2 py-0.5 whitespace-pre">{line.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Online Text Diff Checker</h2>
        <p>
          Compare two blocks of text and instantly see the differences highlighted line by line.
          This diff checker uses the Longest Common Subsequence (LCS) algorithm — the same
          fundamental approach used by Git and other version control systems.
        </p>
        <h3 className="font-semibold text-text-primary">What Can You Compare?</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Source code (JavaScript, Python, Go, Rust, etc.)</li>
          <li>Configuration files (JSON, YAML, TOML, .env)</li>
          <li>SQL queries and database schemas</li>
          <li>API responses and JSON payloads</li>
          <li>Markdown documents and README files</li>
          <li>Plain text, logs, and CSV data</li>
        </ul>
        <h3 className="font-semibold text-text-primary">How to Read the Diff</h3>
        <p>
          Lines highlighted in <strong className="text-green-400">green (+)</strong> were added
          in the modified text. Lines highlighted in <strong className="text-red-400">red (-)</strong> were
          removed from the original text. Unmarked lines are identical in both texts.
        </p>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Line-by-line comparison with unified diff view</li>
          <li>Color-coded additions (green) and deletions (red)</li>
          <li>Line numbers for both original and modified text</li>
          <li>Change statistics (added, removed, unchanged lines)</li>
          <li>Swap function to quickly reverse the comparison</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="diff-checker" />
    </ToolLayout>
  )
}
