import type { ReactNode } from 'react'

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-text-secondary">{description}</p>
      </div>
      {children}
    </div>
  )
}
