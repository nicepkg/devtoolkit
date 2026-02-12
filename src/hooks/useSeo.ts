import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path?: string
}

const BASE_URL = 'https://devtoolkit.pro'
const SITE_NAME = 'DevToolkit'

export function useSeo({ title, description, path = '' }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`
    document.title = fullTitle

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${BASE_URL}${path}`)

    // OG tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:url': `${BASE_URL}${path}`,
    }
    for (const [property, content] of Object.entries(ogTags)) {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
  }, [title, description, path])
}
