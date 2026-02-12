import { Link } from 'react-router-dom'
import { tools } from '@/lib/tools'

interface RelatedToolsProps {
  currentId: string
}

export default function RelatedTools({ currentId }: RelatedToolsProps) {
  const others = tools.filter((t) => t.id !== currentId)
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold text-text-primary mb-4">More Developer Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {others.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-1 hover:border-brand-500/40 hover:bg-surface-2 transition-all"
          >
            <span className="text-brand-400 font-mono text-xs">{tool.category}</span>
            <div>
              <span className="text-sm font-medium">{tool.name}</span>
              <span className="text-xs text-text-muted ml-2">{tool.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
