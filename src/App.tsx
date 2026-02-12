import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import JsonFormatter from '@/pages/tools/JsonFormatter'
import Base64 from '@/pages/tools/Base64'
import CronParser from '@/pages/tools/CronParser'
import JwtDecoder from '@/pages/tools/JwtDecoder'
import UrlEncoder from '@/pages/tools/UrlEncoder'
import UuidGenerator from '@/pages/tools/UuidGenerator'
import TimestampConverter from '@/pages/tools/TimestampConverter'
import HashGenerator from '@/pages/tools/HashGenerator'
import PasswordGenerator from '@/pages/tools/PasswordGenerator'
import DiffChecker from '@/pages/tools/DiffChecker'
import RegexTester from '@/pages/tools/RegexTester'
import ColorConverter from '@/pages/tools/ColorConverter'
import ApiLanding from '@/pages/ApiLanding'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/base64" element={<Base64 />} />
          <Route path="/tools/cron-parser" element={<CronParser />} />
          <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/tools/url-encoder" element={<UrlEncoder />} />
          <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/diff-checker" element={<DiffChecker />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/color-converter" element={<ColorConverter />} />
          <Route path="/api" element={<ApiLanding />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
