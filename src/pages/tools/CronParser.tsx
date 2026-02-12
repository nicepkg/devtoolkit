import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

const FIELD_NAMES = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week']
const FIELD_RANGES = ['0-59', '0-23', '1-31', '1-12', '0-7 (0 & 7 = Sun)']

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every Monday at 9am', value: '0 9 * * 1' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: '1st of month at noon', value: '0 12 1 * *' },
  { label: 'Weekdays at 8:30am', value: '30 8 * * 1-5' },
]

function describeField(value: string, fieldIndex: number): string {
  if (value === '*') return `every ${FIELD_NAMES[fieldIndex].toLowerCase()}`
  if (value.startsWith('*/')) {
    const step = value.slice(2)
    return `every ${step} ${FIELD_NAMES[fieldIndex].toLowerCase()}${Number(step) > 1 ? 's' : ''}`
  }
  if (value.includes(',')) return value.split(',').map((v) => formatValue(v.trim(), fieldIndex)).join(', ')
  if (value.includes('-')) {
    const [start, end] = value.split('-')
    return `${formatValue(start, fieldIndex)} through ${formatValue(end, fieldIndex)}`
  }
  return formatValue(value, fieldIndex)
}

function formatValue(value: string, fieldIndex: number): string {
  const num = Number(value)
  if (fieldIndex === 3 && num >= 1 && num <= 12) return MONTH_NAMES[num]
  if (fieldIndex === 4 && num >= 0 && num <= 7) return DAY_NAMES[num % 7]
  return value
}

function parseCron(expression: string): { description: string; fields: { name: string; value: string; description: string; range: string }[] } | { error: string } {
  const trimmed = expression.trim()
  if (!trimmed) return { error: 'Enter a cron expression' }

  const parts = trimmed.split(/\s+/)
  if (parts.length !== 5) {
    return { error: `Expected 5 fields, got ${parts.length}. Format: minute hour day-of-month month day-of-week` }
  }

  const fields = parts.map((value, i) => ({
    name: FIELD_NAMES[i],
    value,
    description: describeField(value, i),
    range: FIELD_RANGES[i],
  }))

  const [min, hour, dom, month, dow] = parts
  let desc = 'Runs '

  if (min === '*' && hour === '*') {
    desc += 'every minute'
  } else if (min.startsWith('*/')) {
    desc += `every ${min.slice(2)} minutes`
  } else if (hour === '*') {
    desc += `at minute ${min} of every hour`
  } else {
    desc += `at ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`
  }

  if (dom !== '*') desc += ` on day ${dom} of the month`
  if (month !== '*') desc += ` in ${describeField(month, 3)}`
  if (dow !== '*') desc += ` on ${describeField(dow, 4)}`

  return { description: desc, fields }
}

export default function CronParser() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Cron Expression Parser',
      description: 'Free online cron expression parser and explainer with human-readable descriptions.',
      path: '/tools/cron-parser',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is a cron expression?', answer: 'A cron expression is a string of five fields separated by spaces that represents a schedule. It is used in Unix-like systems (crontab), CI/CD pipelines, and task schedulers to define when a job should run.' },
      { question: 'What does * mean in cron?', answer: 'The asterisk (*) in a cron expression means "every" or "any value". For example, * in the minute field means every minute.' },
      { question: 'What is the format of a cron expression?', answer: 'The standard cron format is: minute (0-59) hour (0-23) day-of-month (1-31) month (1-12) day-of-week (0-7, where 0 and 7 are Sunday).' },
    ]),
  ], [])

  useSeo({
    title: 'Cron Expression Parser',
    description: 'Free online cron expression parser and explainer. Understand cron syntax with human-readable descriptions and preset examples. No ads, no tracking.',
    path: '/tools/cron-parser',
    jsonLd,
  })
  const [input, setInput] = useState('0 9 * * 1-5')
  const [result, setResult] = useState(() => parseCron('0 9 * * 1-5'))

  const handleChange = useCallback((value: string) => {
    setInput(value)
    setResult(parseCron(value))
  }, [])

  const descriptionText = 'error' in result ? '' : result.description

  return (
    <ToolLayout
      title="Cron Expression Parser"
      description="Parse cron expressions and see human-readable explanations."
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="* * * * *"
            className="flex-1 px-4 py-3 bg-surface-1 border border-border rounded-lg text-lg font-mono focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
            spellCheck={false}
          />
          {descriptionText && <CopyButton text={descriptionText} />}
        </div>
        <div className="flex gap-0 text-xs text-text-muted font-mono max-w-md">
          {FIELD_NAMES.map((name, i) => (
            <div key={i} className="flex-1 text-center">
              {name.split(' ').map((w, j) => <div key={j}>{w}</div>)}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm text-text-secondary mb-2 block">Presets:</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleChange(preset.value)}
              className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                input === preset.value
                  ? 'border-brand-500/40 bg-brand-500/10 text-brand-400'
                  : 'border-border bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-3'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {'error' in result ? (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {result.error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="px-4 py-3 rounded-lg bg-brand-500/10 border border-brand-500/30">
            <span className="text-sm text-text-secondary">Description: </span>
            <span className="text-brand-400 font-medium">{result.description}</span>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-2">
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Field</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Value</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Description</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Range</th>
                </tr>
              </thead>
              <tbody>
                {result.fields.map((field) => (
                  <tr key={field.name} className="border-t border-border">
                    <td className="px-4 py-2 text-text-primary">{field.name}</td>
                    <td className="px-4 py-2 font-mono text-brand-400">{field.value}</td>
                    <td className="px-4 py-2 text-text-secondary">{field.description}</td>
                    <td className="px-4 py-2 text-text-muted font-mono">{field.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What is a Cron Expression?</h2>
        <p>
          A cron expression is a string of five fields separated by spaces that represents a
          schedule. It's used in Unix-like systems (crontab), CI/CD pipelines, and task schedulers
          to define when a job should run.
        </p>
        <h3 className="font-semibold text-text-primary">Cron Syntax</h3>
        <pre className="p-4 bg-surface-1 border border-border rounded-lg overflow-x-auto">
{`┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-7, Sun=0 or 7)
│ │ │ │ │
* * * * *`}
        </pre>
        <h3 className="font-semibold text-text-primary">Special Characters</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="bg-surface-2 px-1 rounded">*</code> — any value</li>
          <li><code className="bg-surface-2 px-1 rounded">,</code> — value list separator (1,3,5)</li>
          <li><code className="bg-surface-2 px-1 rounded">-</code> — range (1-5)</li>
          <li><code className="bg-surface-2 px-1 rounded">/</code> — step values (*/5 = every 5)</li>
        </ul>
      </div>

      <RelatedTools currentId="cron-parser" />
    </ToolLayout>
  )
}
