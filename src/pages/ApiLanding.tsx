import ToolLayout from '@/components/ToolLayout'
import { useSeo } from '@/hooks/useSeo'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    requests: '100 requests/month',
    features: ['Screenshot API', 'PDF generation', '1280x720 viewport', '5s timeout', 'Community support'],
    cta: 'Get Free API Key',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$15',
    period: '/month',
    requests: '2,000 requests/month',
    features: ['Everything in Free', 'Custom viewport sizes', '30s timeout', 'Full-page screenshots', 'Email support'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    requests: '10,000 requests/month',
    features: ['Everything in Starter', 'Block ads & cookies', 'Custom CSS injection', 'Webhook notifications', 'Priority support'],
    cta: 'Go Pro',
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$79',
    period: '/month',
    requests: '50,000 requests/month',
    features: ['Everything in Pro', 'Custom headers', 'Geolocation targeting', '99.9% SLA', 'Dedicated support'],
    cta: 'Contact Us',
    highlighted: false,
  },
]

export default function ApiLanding() {
  useSeo({
    title: 'Screenshot & PDF API',
    description: 'Capture website screenshots and generate PDFs via API. Fast, reliable, built on edge infrastructure. Starting at $15/month.',
    path: '/api',
  })
  return (
    <ToolLayout
      title="Screenshot & PDF API"
      description="Capture website screenshots and generate PDFs programmatically."
    >
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 text-xs text-brand-400 border border-brand-500/30 rounded-full mb-4">
          Coming Soon
        </span>
        <h2 className="text-2xl font-bold mb-3">
          Website Screenshots & PDFs via API
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          One API call to capture any URL as a screenshot or PDF. Built on edge infrastructure
          for fast, reliable rendering worldwide. No browser management required.
        </p>
      </div>

      {/* Code example */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-surface-2 text-sm text-text-secondary">
            Quick Example
          </div>
          <pre className="p-4 bg-surface-1 text-sm overflow-x-auto">
            <code>{`curl "https://api.devtoolkit.pro/screenshot?url=https://example.com" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -o screenshot.png`}</code>
          </pre>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-lg border p-5 ${
              tier.highlighted
                ? 'border-brand-500/50 bg-brand-500/5'
                : 'border-border bg-surface-1'
            }`}
          >
            <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
            <div className="mb-1">
              <span className="text-2xl font-bold">{tier.price}</span>
              <span className="text-text-muted text-sm">{tier.period}</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">{tier.requests}</p>
            <ul className="space-y-2 mb-6">
              {tier.features.map((feature) => (
                <li key={feature} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5">+</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded text-sm font-medium transition-colors ${
                tier.highlighted
                  ? 'bg-brand-500 hover:bg-brand-600 text-white'
                  : 'bg-surface-2 hover:bg-surface-3 border border-border text-text-secondary'
              }`}
              disabled
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Waitlist */}
      <div className="max-w-md mx-auto text-center p-6 rounded-lg border border-brand-500/30 bg-brand-500/5">
        <h3 className="font-semibold mb-2">Join the Waitlist</h3>
        <p className="text-sm text-text-secondary mb-4">
          Be the first to know when the API launches. Early adopters get 2x free quota.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2 bg-surface-1 border border-border rounded text-sm focus:outline-none focus:border-brand-500/50 placeholder:text-text-muted"
          />
          <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded text-sm font-medium transition-colors">
            Notify Me
          </button>
        </div>
      </div>

      {/* Use cases */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Use Cases</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Generate social media preview images (Open Graph)</li>
          <li>Create PDF reports from web pages</li>
          <li>Website monitoring and change detection</li>
          <li>Automated visual regression testing</li>
          <li>Link preview thumbnails for your app</li>
          <li>Archive web pages as images or PDFs</li>
        </ul>
      </div>
    </ToolLayout>
  )
}
