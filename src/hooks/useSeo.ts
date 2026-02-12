import { useEffect, useMemo } from 'react'

interface SeoProps {
  title: string
  description: string
  path?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

// TODO: Change to custom domain once bound
const BASE_URL = 'https://devtoolkit-dws.pages.dev'
const SITE_NAME = 'DevToolkit'

export function useSeo({ title, description, path = '', jsonLd }: SeoProps) {
  const jsonLdString = useMemo(() => jsonLd ? JSON.stringify(jsonLd) : null, [jsonLd])

  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`
    document.title = fullTitle

    // Cloudflare Pages serves directory routes with trailing slash (308 redirect).
    // Canonical/OG URLs must match the final URL to avoid redirect-canonical mismatch.
    const canonicalPath = path === '/' || path === '' ? '/' : `${path}/`
    const pageUrl = `${BASE_URL}${canonicalPath}`

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
    canonical.setAttribute('href', pageUrl)

    // OG tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:url': pageUrl,
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

    // JSON-LD structured data
    if (jsonLdString) {
      const existingScript = document.querySelector('script[data-seo-jsonld]')
      if (existingScript) existingScript.remove()

      const script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.setAttribute('data-seo-jsonld', '')
      script.textContent = jsonLdString
      document.head.appendChild(script)

      return () => {
        script.remove()
      }
    }
  }, [title, description, path, jsonLdString])
}

// Helper: create WebApplication schema for tool pages
export function toolJsonLd(opts: {
  name: string
  description: string
  path: string
  category: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}${opts.path}/`,
    applicationCategory: opts.category,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript. Works in all modern browsers.',
  }
}

// Helper: create FAQPage schema
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
