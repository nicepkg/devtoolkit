import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(clean)) return null
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex(rgb: RGB): string {
  return '#' + [rgb.r, rgb.g, rgb.b].map(c =>
    clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')
  ).join('')
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
  }
}

function luminance(rgb: RGB): number {
  const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = luminance(rgb1), l2 = luminance(rgb2)
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export default function ColorConverter() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Color Converter',
      description: 'Convert colors between HEX, RGB, and HSL formats. Preview colors and check contrast ratios.',
      path: '/tools/color-converter',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What is the difference between HEX, RGB, and HSL?', answer: 'HEX is a 6-character hexadecimal notation (#RRGGBB) commonly used in CSS. RGB defines colors with Red, Green, Blue values from 0-255. HSL uses Hue (0-360 degrees), Saturation (0-100%), and Lightness (0-100%), which is more intuitive for humans to adjust.' },
      { question: 'How do I convert HEX to RGB?', answer: 'Split the hex color into 3 pairs of characters (RR, GG, BB) and convert each pair from hexadecimal to decimal. For example, #1E90FF becomes R=30, G=144, B=255.' },
      { question: 'What is WCAG contrast ratio?', answer: 'WCAG (Web Content Accessibility Guidelines) defines contrast ratios for accessible text. Level AA requires 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 for normal text and 4.5:1 for large text.' },
    ]),
  ], [])

  useSeo({
    title: 'Color Converter — HEX, RGB, HSL',
    description: 'Free online color converter. Convert between HEX, RGB, and HSL color formats. Color picker, contrast checker, and CSS output. No ads, no tracking.',
    path: '/tools/color-converter',
    jsonLd,
  })

  const [hex, setHex] = useState('#1E90FF')
  const [rgb, setRgb] = useState<RGB>({ r: 30, g: 144, b: 255 })
  const [hsl, setHsl] = useState<HSL>(() => rgbToHsl({ r: 30, g: 144, b: 255 }))

  const updateFromHex = useCallback((value: string) => {
    setHex(value)
    const parsed = hexToRgb(value)
    if (parsed) {
      setRgb(parsed)
      setHsl(rgbToHsl(parsed))
    }
  }, [])

  const updateFromRgb = useCallback((newRgb: RGB) => {
    const clamped = { r: clamp(newRgb.r, 0, 255), g: clamp(newRgb.g, 0, 255), b: clamp(newRgb.b, 0, 255) }
    setRgb(clamped)
    setHex(rgbToHex(clamped))
    setHsl(rgbToHsl(clamped))
  }, [])

  const updateFromHsl = useCallback((newHsl: HSL) => {
    const clamped = { h: clamp(newHsl.h, 0, 360), s: clamp(newHsl.s, 0, 100), l: clamp(newHsl.l, 0, 100) }
    setHsl(clamped)
    const newRgb = hslToRgb(clamped)
    setRgb(newRgb)
    setHex(rgbToHex(newRgb))
  }, [])

  const updateFromPicker = useCallback((value: string) => {
    setHex(value)
    const parsed = hexToRgb(value)
    if (parsed) {
      setRgb(parsed)
      setHsl(rgbToHsl(parsed))
    }
  }, [])

  const whiteContrast = contrastRatio(rgb, { r: 255, g: 255, b: 255 })
  const blackContrast = contrastRatio(rgb, { r: 0, g: 0, b: 0 })

  const cssValues = useMemo(() => ({
    hex: hex.toLowerCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  }), [hex, rgb, hsl])

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB, and HSL formats."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-4">
          {/* Color picker + preview */}
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={hex.length === 7 ? hex : '#000000'}
              onChange={e => updateFromPicker(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer border border-border"
            />
            <div
              className="flex-1 h-16 rounded-lg border border-border"
              style={{ backgroundColor: cssValues.hex }}
            />
          </div>

          {/* HEX */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-text-secondary font-medium">HEX</label>
              <CopyButton text={cssValues.hex} />
            </div>
            <input
              type="text"
              value={hex}
              onChange={e => updateFromHex(e.target.value)}
              className="w-full px-4 py-3 bg-surface-1 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-brand-500/50"
              spellCheck={false}
            />
          </div>

          {/* RGB */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-text-secondary font-medium">RGB</label>
              <CopyButton text={cssValues.rgb} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['r', 'g', 'b'] as const).map(ch => (
                <div key={ch}>
                  <label className="text-xs text-text-muted uppercase">{ch}</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={e => updateFromRgb({ ...rgb, [ch]: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HSL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-text-secondary font-medium">HSL</label>
              <CopyButton text={cssValues.hsl} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-text-muted">H (0-360)</label>
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={e => updateFromHsl({ ...hsl, h: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">S (0-100%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={e => updateFromHsl({ ...hsl, s: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">L (0-100%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={e => updateFromHsl({ ...hsl, l: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-surface-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-brand-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: CSS output + contrast */}
        <div className="space-y-4">
          {/* CSS Values */}
          <div>
            <label className="text-sm text-text-secondary font-medium mb-2 block">CSS Values</label>
            <div className="space-y-2">
              {Object.entries(cssValues).map(([format, value]) => (
                <div key={format} className="flex items-center gap-2 p-3 bg-surface-1 border border-border rounded-lg">
                  <span className="text-xs text-text-muted uppercase w-8">{format}</span>
                  <code className="flex-1 text-sm font-mono text-brand-300">{value}</code>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          </div>

          {/* Contrast checker */}
          <div>
            <label className="text-sm text-text-secondary font-medium mb-2 block">WCAG Contrast</label>
            <div className="space-y-2">
              <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: cssValues.hex }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'white' }}>White text</span>
                  <span className="text-xs font-mono" style={{ color: 'white' }}>
                    {whiteContrast.toFixed(2)}:1
                    {whiteContrast >= 7 ? ' AAA' : whiteContrast >= 4.5 ? ' AA' : ' Fail'}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: cssValues.hex }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'black' }}>Black text</span>
                  <span className="text-xs font-mono" style={{ color: 'black' }}>
                    {blackContrast.toFixed(2)}:1
                    {blackContrast >= 7 ? ' AAA' : blackContrast >= 4.5 ? ' AA' : ' Fail'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color shades */}
          <div>
            <label className="text-sm text-text-secondary font-medium mb-2 block">Shades</label>
            <div className="flex rounded-lg overflow-hidden border border-border">
              {[10, 30, 50, 70, 90].map(l => {
                const shadeRgb = hslToRgb({ ...hsl, l })
                const shadeHex = rgbToHex(shadeRgb)
                return (
                  <button
                    key={l}
                    onClick={() => updateFromHsl({ ...hsl, l })}
                    className="flex-1 h-10 relative group cursor-pointer"
                    style={{ backgroundColor: shadeHex }}
                    title={shadeHex}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: l > 50 ? 'black' : 'white' }}>
                      {l}%
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Color Formats for Web Development</h2>
        <p>
          Web developers work with multiple color formats daily. <strong>HEX</strong> (#RRGGBB) is the most
          common in CSS, using hexadecimal values from 00 to FF. <strong>RGB</strong> defines colors with
          Red, Green, Blue channels from 0-255. <strong>HSL</strong> (Hue, Saturation, Lightness) is the
          most intuitive for humans — adjusting brightness or creating color variations is straightforward.
        </p>
        <h3 className="font-semibold text-text-primary">HEX to RGB Conversion</h3>
        <p>
          Split the 6-character hex code into 3 pairs. Convert each pair from base-16 to base-10.
          For example: <code className="text-brand-300">#1E90FF</code> → R=30 (0x1E), G=144 (0x90), B=255 (0xFF).
        </p>
        <h3 className="font-semibold text-text-primary">WCAG Accessibility</h3>
        <p>
          The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios for readable text.
          <strong> Level AA</strong>: 4.5:1 for normal text, 3:1 for large text.
          <strong> Level AAA</strong>: 7:1 for normal text, 4.5:1 for large text.
          Always check contrast when choosing text and background colors.
        </p>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Convert between HEX, RGB, and HSL instantly</li>
          <li>Native color picker integration</li>
          <li>WCAG contrast ratio checker for accessibility</li>
          <li>Lightness shade variations</li>
          <li>Copy CSS values with one click</li>
          <li>100% client-side — your data never leaves your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="color-converter" />
    </ToolLayout>
  )
}
