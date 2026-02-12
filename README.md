# DevToolkit

Free, fast, and private developer tools. No ads, no tracking — everything runs in your browser.

**[devtoolkit-dws.pages.dev](https://devtoolkit-dws.pages.dev)**

## Tools

| Tool | Description |
|------|-------------|
| [JSON Formatter](https://devtoolkit-dws.pages.dev/tools/json-formatter) | Format, validate, and minify JSON with syntax highlighting |
| [Base64 Encoder/Decoder](https://devtoolkit-dws.pages.dev/tools/base64) | Encode and decode Base64 strings |
| [Cron Expression Parser](https://devtoolkit-dws.pages.dev/tools/cron-parser) | Parse and explain cron expressions with next run times |
| [JWT Decoder](https://devtoolkit-dws.pages.dev/tools/jwt-decoder) | Decode and inspect JSON Web Tokens |
| [URL Encoder/Decoder](https://devtoolkit-dws.pages.dev/tools/url-encoder) | Encode and decode URL components |
| [UUID Generator](https://devtoolkit-dws.pages.dev/tools/uuid-generator) | Generate v4 UUIDs in bulk |
| [Timestamp Converter](https://devtoolkit-dws.pages.dev/tools/timestamp-converter) | Convert between Unix timestamps and human-readable dates |
| [Hash Generator](https://devtoolkit-dws.pages.dev/tools/hash-generator) | Generate MD5, SHA-1, SHA-256, SHA-512 hashes |
| [Password Generator](https://devtoolkit-dws.pages.dev/tools/password-generator) | Generate secure passwords with customizable rules |
| [Text Diff Checker](https://devtoolkit-dws.pages.dev/tools/diff-checker) | Compare two texts side-by-side with highlighted differences |
| [Regex Tester](https://devtoolkit-dws.pages.dev/tools/regex-tester) | Test regular expressions with real-time matching and flag controls |
| [Color Converter](https://devtoolkit-dws.pages.dev/tools/color-converter) | Convert between HEX, RGB, HSL with WCAG contrast checking |

## Features

- **100% Client-Side** — Nothing leaves your browser. Zero server-side processing.
- **No Ads, No Tracking** — No analytics, no cookies, no third-party scripts.
- **Fast** — Static pre-rendered pages. No loading spinners.
- **12 Tools** — And growing.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/) + [Tailwind CSS 4](https://tailwindcss.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/) (hosting)
- Pre-rendered static HTML for SEO

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build    # TypeScript check + Vite build + sitemap + prerender
npm run preview  # Preview production build locally
```

## License

MIT
