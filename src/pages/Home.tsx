import { Link } from 'react-router-dom'
import React, { useMemo } from 'react'
import { tools } from '@/lib/tools'
import { useSeo } from '@/hooks/useSeo'

/* ── Category SVG Icons ── */

function DataIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  )
}

function EncodingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <polyline points="7 15 3 19 7 23" />
      <line x1="3" y1="5" x2="21" y2="19" />
    </svg>
  )
}

function DevOpsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}

function SecurityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

const categoryIconMap: Record<string, React.FC> = {
  Data: DataIcon,
  Encoding: EncodingIcon,
  DevOps: DevOpsIcon,
  Security: SecurityIcon,
}

function CategoryIcon({ category }: { category: string }) {
  const Icon = categoryIconMap[category]
  if (!Icon) return null
  return <Icon />
}

/* ── Home Page ── */

export default function Home() {
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevToolkit',
    url: 'https://devtoolkit-dws.pages.dev',
    description: 'Free online developer tools. JSON Formatter, Regex Tester, Color Converter, Base64, UUID Generator, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://devtoolkit-dws.pages.dev/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }), [])

  useSeo({
    title: 'Free Online Developer Tools',
    description: 'Free online developer tools: JSON Formatter, Regex Tester, Color Converter, Base64, UUID Generator, Password Generator, Diff Checker, Hash Generator, and more. Fast, private, no tracking.',
    path: '/',
    jsonLd,
  })

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-16 mt-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
          Developer Tools
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          Free, fast, and private. No ads, no tracking, no server-side processing.
          Everything runs in your browser.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group block p-6 rounded-xl border border-border bg-surface-1 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                <CategoryIcon category={tool.category} />
              </div>
              <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                {tool.category}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-1.5 group-hover:text-brand-400 transition-colors">
              {tool.name}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
