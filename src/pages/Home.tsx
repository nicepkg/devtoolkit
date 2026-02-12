import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { tools } from '@/lib/tools'
import { useSeo } from '@/hooks/useSeo'

const categoryIcons: Record<string, string> = {
  Data: '{;}',
  Encoding: '</>',
  DevOps: '$ _',
  Security: '[*]',
}

export default function Home() {
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevToolkit',
    url: 'https://devtoolkit-dws.pages.dev',
    description: 'Free online developer tools. JSON Formatter, Base64 Encoder/Decoder, Cron Parser, JWT Decoder, URL Encoder.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://devtoolkit-dws.pages.dev/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }), [])

  useSeo({
    title: 'Free Online Developer Tools',
    description: 'Free online developer tools. JSON Formatter, Base64, UUID Generator, Password Generator, Diff Checker, Hash Generator, and more. Fast, private, no tracking.',
    path: '/',
    jsonLd,
  })
  return (
    <div>
      <div className="text-center mb-12 mt-8">
        <h1 className="text-3xl font-bold mb-3">Developer Tools</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Free, fast, and private. No ads, no tracking, no server-side processing.
          Everything runs in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group block p-5 rounded-lg border border-border bg-surface-1 hover:border-brand-500/40 hover:bg-surface-2 transition-all"
          >
            <div className="text-brand-400 font-mono text-sm mb-2">
              {categoryIcons[tool.category] || '> _'}
            </div>
            <h2 className="text-lg font-semibold mb-1 group-hover:text-brand-400 transition-colors">
              {tool.name}
            </h2>
            <p className="text-sm text-text-secondary">
              {tool.description}
            </p>
          </Link>
        ))}

        {/* API Card */}
        <Link
          to="/api"
          className="group block p-5 rounded-lg border border-brand-500/30 bg-brand-500/5 hover:border-brand-500/60 hover:bg-brand-500/10 transition-all"
        >
          <div className="text-brand-400 font-mono text-sm mb-2">API</div>
          <h2 className="text-lg font-semibold mb-1 group-hover:text-brand-400 transition-colors">
            Screenshot API
          </h2>
          <p className="text-sm text-text-secondary">
            Capture website screenshots and generate PDFs via API.
            Starting at $15/month.
          </p>
          <span className="inline-block mt-2 text-xs text-brand-400 border border-brand-500/30 rounded px-2 py-0.5">
            Coming Soon
          </span>
        </Link>
      </div>
    </div>
  )
}
