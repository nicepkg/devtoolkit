import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

function formatTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

export default function TimestampConverter() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Unix Timestamp Converter',
      description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.',
      path: '/tools/timestamp-converter',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp (also called Epoch time or POSIX time) is the number of seconds that have elapsed since January 1, 1970 at 00:00:00 UTC. It is widely used in programming, databases, APIs, and log files to represent dates and times in a timezone-independent format.' },
      { question: 'What is the difference between seconds and milliseconds timestamps?', answer: 'A Unix timestamp in seconds is typically 10 digits (e.g., 1700000000). JavaScript, Java, and many APIs use millisecond timestamps which are 13 digits (e.g., 1700000000000). This tool auto-detects the format and converts both.' },
      { question: 'What is the Year 2038 problem?', answer: 'The Year 2038 problem occurs because many systems store Unix timestamps as 32-bit signed integers, which can only represent dates up to January 19, 2038. After that, the integer overflows. Modern systems use 64-bit integers to avoid this issue.' },
    ]),
  ], [])

  useSeo({
    title: 'Unix Timestamp Converter',
    description: 'Free online Unix timestamp converter. Convert epoch time to human dates and back. Auto-detects seconds vs milliseconds. Shows UTC and local time.',
    path: '/tools/timestamp-converter',
    jsonLd,
  })

  const [timestampInput, setTimestampInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [tsResult, setTsResult] = useState<{ utc: string; local: string; iso: string; relative: string; ms: number } | null>(null)
  const [dateResult, setDateResult] = useState<{ seconds: number; milliseconds: number } | null>(null)
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())

  const timezone = useMemo(() => formatTimezone(), [])

  const getRelativeTime = (ms: number): string => {
    const diff = Date.now() - ms
    const abs = Math.abs(diff)
    const future = diff < 0
    const prefix = future ? 'in ' : ''
    const suffix = future ? '' : ' ago'

    if (abs < 60_000) return `${prefix}${Math.floor(abs / 1000)}s${suffix}`
    if (abs < 3_600_000) return `${prefix}${Math.floor(abs / 60_000)}m${suffix}`
    if (abs < 86_400_000) return `${prefix}${Math.floor(abs / 3_600_000)}h${suffix}`
    if (abs < 2_592_000_000) return `${prefix}${Math.floor(abs / 86_400_000)}d${suffix}`
    if (abs < 31_536_000_000) return `${prefix}${Math.floor(abs / 2_592_000_000)}mo${suffix}`
    return `${prefix}${Math.floor(abs / 31_536_000_000)}y${suffix}`
  }

  const handleTimestampConvert = (value: string) => {
    setTimestampInput(value)
    setError('')
    setTsResult(null)

    const trimmed = value.trim()
    if (!trimmed) return

    const num = Number(trimmed)
    if (isNaN(num)) {
      setError('Invalid timestamp. Enter a number (seconds or milliseconds).')
      return
    }

    // Auto-detect seconds vs milliseconds
    const ms = trimmed.length >= 13 ? num : num * 1000
    const date = new Date(ms)

    if (isNaN(date.getTime())) {
      setError('Invalid timestamp value.')
      return
    }

    setTsResult({
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString(),
      relative: getRelativeTime(ms),
      ms,
    })
  }

  const handleDateConvert = (value: string) => {
    setDateInput(value)
    setError('')
    setDateResult(null)

    if (!value.trim()) return

    const date = new Date(value)
    if (isNaN(date.getTime())) {
      setError('Invalid date string. Try ISO 8601 format: 2024-01-15T10:30:00Z')
      return
    }

    setDateResult({
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    })
  }

  const setCurrentTimestamp = () => {
    const ts = Date.now()
    setNow(ts)
    handleTimestampConvert(String(Math.floor(ts / 1000)))
  }

  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and vice versa."
    >
      {/* Current time display */}
      <div className="mb-6 p-4 bg-surface-1 border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-muted mb-1">Current Unix Timestamp</div>
            <div className="text-2xl font-mono font-bold text-brand-400">{Math.floor(now / 1000)}</div>
          </div>
          <button
            onClick={() => setNow(Date.now())}
            className="px-3 py-2 bg-surface-2 hover:bg-surface-3 border border-border rounded text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="text-xs text-text-muted mt-1">
          {new Date(now).toISOString()} ({timezone})
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp → Date */}
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Timestamp → Date</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => handleTimestampConvert(e.target.value)}
              placeholder="e.g. 1700000000 or 1700000000000"
              className="flex-1 px-4 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
              spellCheck={false}
            />
            <button
              onClick={setCurrentTimestamp}
              className="px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded text-sm transition-colors whitespace-nowrap"
            >
              Now
            </button>
          </div>
          {tsResult && (
            <div className="space-y-2 p-4 bg-surface-1 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">UTC</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{tsResult.utc}</span>
                  <CopyButton text={tsResult.utc} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Local</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{tsResult.local}</span>
                  <CopyButton text={tsResult.local} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">ISO 8601</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{tsResult.iso}</span>
                  <CopyButton text={tsResult.iso} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Relative</span>
                <span className="text-sm text-brand-400">{tsResult.relative}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date → Timestamp */}
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Date → Timestamp</h2>
          <input
            type="text"
            value={dateInput}
            onChange={(e) => handleDateConvert(e.target.value)}
            placeholder="e.g. 2024-01-15T10:30:00Z"
            className="w-full px-4 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted mb-3"
            spellCheck={false}
          />
          {dateResult && (
            <div className="space-y-2 p-4 bg-surface-1 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Seconds</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{dateResult.seconds}</span>
                  <CopyButton text={String(dateResult.seconds)} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Milliseconds</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{dateResult.milliseconds}</span>
                  <CopyButton text={String(dateResult.milliseconds)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is a Unix Timestamp?</h2>
        <p>
          A Unix timestamp (also called Epoch time or POSIX time) is the number of seconds elapsed
          since January 1, 1970 at 00:00:00 UTC. It's the standard way to represent time in
          programming, databases, APIs, and log files because it's timezone-independent and easy
          to compare.
        </p>
        <h3 className="font-semibold text-text-primary">Seconds vs Milliseconds</h3>
        <p>
          Most Unix systems use seconds (10 digits, e.g., <code className="text-brand-400">1700000000</code>).
          JavaScript's <code className="text-brand-400">Date.now()</code>, Java's{' '}
          <code className="text-brand-400">System.currentTimeMillis()</code>, and many APIs return
          milliseconds (13 digits, e.g., <code className="text-brand-400">1700000000000</code>).
          This tool auto-detects the format.
        </p>
        <h3 className="font-semibold text-text-primary">Common Use Cases</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Debugging API responses with epoch timestamps</li>
          <li>Converting log file timestamps to human-readable dates</li>
          <li>Setting cookie and token expiration times</li>
          <li>Database timestamp field analysis</li>
          <li>Calculating time differences between events</li>
        </ul>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Auto-detects seconds vs milliseconds input</li>
          <li>Shows UTC, local time, ISO 8601, and relative time</li>
          <li>Bi-directional: timestamp → date and date → timestamp</li>
          <li>Live current timestamp display</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="timestamp-converter" />
    </ToolLayout>
  )
}
