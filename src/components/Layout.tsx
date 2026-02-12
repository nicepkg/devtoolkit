import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { tools } from '@/lib/tools'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Layout() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-surface-1">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-text-primary hover:text-brand-400 transition-colors">
            DevToolkit
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === tool.path
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`}
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/api"
            className="text-sm text-text-secondary hover:text-brand-400 transition-colors"
          >
            API
          </Link>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden border-b border-border bg-surface-1 px-4 py-2 flex gap-2 overflow-x-auto">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
              location.pathname === tool.path
                ? 'bg-brand-500/15 text-brand-400'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tool.name}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center text-sm text-text-muted">
        Free developer tools. No ads, no tracking.
      </footer>
    </div>
  )
}
