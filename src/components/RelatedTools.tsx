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
            className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-1 hover:border-brand-500/40 hover:shadow-md hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="shrink-0 text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
              {tool.category}
            </span>
            <div className="min-w-0">
              <span className="text-sm font-medium group-hover:text-brand-400 transition-colors">
                {tool.name}
              </span>
              <span className="text-xs text-text-muted ml-2 hidden sm:inline">
                {tool.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
