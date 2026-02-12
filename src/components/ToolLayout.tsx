import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/" className="hover:text-text-secondary transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{title}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-text-secondary text-lg">{description}</p>
      </div>
      {children}
    </div>
  )
}
