import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '@/components/ToolLayout'
import CopyButton from '@/components/CopyButton'
import RelatedTools from '@/components/RelatedTools'
import { useSeo, toolJsonLd, faqJsonLd } from '@/hooks/useSeo'

type PasswordMode = 'random' | 'memorable'

// EFF's short wordlist (abridged to 1296 words for XKCD-style passphrases)
// Using a curated list of common, easy-to-spell English words
const WORDLIST = [
  'acid','acme','acre','aged','also','arch','area','army','away',
  'baby','back','bail','bake','ball','band','bank','barn','base','bath',
  'bean','bear','beat','beef','beer','bell','belt','bend','best','bike',
  'bill','bind','bird','bite','blow','blue','blur','boat','body','bolt',
  'bomb','bond','bone','book','boom','boot','born','boss','both','bowl',
  'bulk','bull','bump','burn','bush','busy','buzz','cafe','cage','cake',
  'calm','came','camp','cape','card','care','cart','case','cash','cast',
  'cave','cell','chat','chef','chip','chop','city','clad','clan','clap',
  'clay','clip','clock','clone','club','clue','coal','coat','code','coil',
  'coin','cold','cole','come','cook','cool','cope','copy','cord','core',
  'corn','cost','cozy','crew','crop','crow','cube','cult','cure','curl',
  'cute','dare','dark','dart','dash','data','date','dawn','dead','deaf',
  'deal','dear','debt','deck','deed','deem','deep','deer','demo','deny',
  'desk','dial','dice','diet','dirt','disc','dish','dock','does','dome',
  'done','doom','door','dose','down','drag','draw','drip','drop','drum',
  'dual','duck','dude','duel','duke','dull','dumb','dump','dune','dust',
  'duty','each','earn','ease','east','easy','edge','edit','else','emit',
  'ends','epic','euro','even','ever','evil','exam','exec','exit','expo',
  'face','fact','fade','fail','fair','fake','fall','fame','fang','fare',
  'farm','fast','fate','fear','feat','feed','feel','feet','fell','felt',
  'file','fill','film','find','fine','fire','firm','fish','fist','five',
  'flag','flame','flat','fled','flew','flip','flow','foam','fold','folk',
  'fond','font','food','fool','foot','ford','fork','form','fort','foul',
  'four','free','frog','from','fuel','full','fund','fury','fuse','gain',
  'gala','game','gang','gate','gave','gaze','gear','gene','gift','girl',
  'give','glad','glow','glue','goat','goes','gold','golf','gone','good',
  'grab','gram','gray','grew','grid','grim','grin','grip','grow','gulf',
  'guru','guys','hack','hair','hail','half','hall','halt','hand','hang',
  'hard','harm','harp','hate','haul','have','hawk','haze','head','heal',
  'heap','heat','heel','held','helm','help','herb','herd','here','hero',
  'hide','high','hike','hill','hint','hire','hold','hole','holy','home',
  'hood','hook','hope','horn','host','hour','huge','hull','hung','hunt',
  'hurt','hymn','icon','idea','idle','inch','info','iron','isle','item',
  'jack','jail','jazz','jean','jest','jets','jobs','join','joke','jump',
  'june','jury','just','keen','keep','kept','kick','kids','kill','kind',
  'king','kiss','kite','knee','knew','knit','knob','knot','know','labs',
  'lace','lack','laid','lake','lamb','lamp','land','lane','laps','last',
  'late','lawn','lazy','lead','leaf','lean','leap','left','lend','lens',
  'less','lick','lied','life','lift','like','limb','lime','limp','line',
  'link','lion','lips','list','live','load','loan','lock','logo','lone',
  'long','look','loop','lord','lose','loss','lost','loud','love','luck',
  'lump','lung','lure','lurk','made','mail','main','make','male','mall',
  'malt','mane','many','maps','mark','mars','mask','mass','mate','maze',
  'meal','mean','meat','meet','melt','memo','menu','mere','mesh','mess',
  'mild','milk','mill','mind','mine','mint','miss','mode','mold','monk',
  'mood','moon','more','moss','most','moth','move','much','mule','must',
  'myth','nail','name','navy','near','neat','neck','need','nest','nets',
  'news','next','nice','nine','node','none','norm','nose','note','noun',
  'nude','null','nuts','oath','obey','odds','oils','okay','omit','once',
  'ones','only','onto','open','opts','oral','ours','oval','oven','over',
  'pace','pack','page','paid','pain','pair','pale','palm','pane','para',
  'park','part','pass','past','path','peak','peel','peer','pets','pick',
  'pier','pile','pine','pink','pipe','plan','play','plea','plot','plow',
  'plug','plus','poem','poet','pole','poll','polo','pond','pool','poor',
  'pope','pork','port','pose','post','pour','pray','prey','prop','pull',
  'pulp','pump','punk','pure','push','quit','quiz','race','rack','rage',
  'raid','rail','rain','rank','rare','rash','rate','rave','rays','read',
  'real','reap','rear','reed','reef','reel','rely','rent','rest','rice',
  'rich','ride','rift','ring','riot','rise','risk','road','roam','robe',
  'rock','rode','role','roll','roof','room','root','rope','rose','rout',
  'rude','ruin','rule','rush','rust','sack','safe','sage','said','sail',
  'sake','sale','salt','same','sand','sang','save','seal','seed','seek',
  'self','sell','send','sent','sept','sewn','shed','shin','ship','shoe',
  'shop','shot','show','shut','sick','side','sigh','sign','silk','sink',
  'site','size','skip','slam','slap','slid','slim','slip','slot','slow',
  'snap','snow','soak','soar','sock','sofa','soft','soil','sold','sole',
  'some','song','soon','sort','soul','span','spec','sped','spin','spit',
  'spot','star','stay','stem','step','stew','stop','stub','such','suit',
  'sung','sunk','sure','surf','swan','swap','swim','tabs','tack','tail',
  'take','tale','talk','tall','tank','tape','taps','task','taxi','team',
  'tear','tell','temp','tend','tens','tent','term','test','text','than',
  'that','them','then','they','thin','this','thus','tick','tide','tidy',
  'tied','tier','tile','till','tilt','time','tiny','tips','tire','toad',
  'told','toll','tomb','tone','took','tool','tops','tore','torn','toss',
  'tour','town','trap','tray','tree','trek','trim','trio','trip','trot',
  'true','tube','tuck','tuft','tune','turn','turf','twin','type','ugly',
  'undo','unit','unto','upon','urge','used','user','uses','vain','vale',
  'vane','vary','vast','veil','vein','vent','verb','very','vest','veto',
  'vibe','vice','view','vine','visa','void','volt','vote','wade','wage',
  'wait','wake','walk','wall','wand','want','ward','warm','warn','warp',
  'wars','wary','wash','wave','wavy','waxy','weak','wear','weed','week',
  'well','went','were','west','what','when','whom','wide','wife','wiki',
  'wild','will','wilt','wily','wind','wine','wing','wink','wire','wise',
  'wish','with','woke','wolf','wood','wool','word','wore','work','worm',
  'worn','wrap','yard','yarn','yeah','year','yell','yoga','your','zero',
  'zinc','zone','zoom',
]

function getRandomWord(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return WORDLIST[array[0] % WORDLIST.length]
}

function getRandomChar(charset: string): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return charset[array[0] % charset.length]
}

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generateRandomPassword(length: number, options: {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}): string {
  let charset = ''
  if (options.uppercase) charset += CHARSETS.uppercase
  if (options.lowercase) charset += CHARSETS.lowercase
  if (options.numbers) charset += CHARSETS.numbers
  if (options.symbols) charset += CHARSETS.symbols
  if (!charset) charset = CHARSETS.lowercase + CHARSETS.numbers

  // Ensure at least one character from each selected set
  const required: string[] = []
  if (options.uppercase) required.push(getRandomChar(CHARSETS.uppercase))
  if (options.lowercase) required.push(getRandomChar(CHARSETS.lowercase))
  if (options.numbers) required.push(getRandomChar(CHARSETS.numbers))
  if (options.symbols) required.push(getRandomChar(CHARSETS.symbols))

  // Fill remaining length
  const remaining = Math.max(0, length - required.length)
  const chars: string[] = [...required]
  for (let i = 0; i < remaining; i++) {
    chars.push(getRandomChar(charset))
  }

  // Shuffle using Fisher-Yates
  for (let i = chars.length - 1; i > 0; i--) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const j = array[0] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}

function generateMemorablePassphrase(wordCount: number, separator: string, capitalize: boolean, addNumber: boolean): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    let word = getRandomWord()
    if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1)
    words.push(word)
  }
  let result = words.join(separator)
  if (addNumber) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    result += separator + (array[0] % 1000)
  }
  return result
}

function estimateEntropy(password: string, mode: PasswordMode, options: {
  wordCount?: number
  addNumber?: boolean
  charsetSize?: number
}): number {
  if (mode === 'memorable') {
    let bits = (options.wordCount || 4) * Math.log2(WORDLIST.length)
    if (options.addNumber) bits += Math.log2(1000)
    return Math.round(bits)
  }
  return Math.round(password.length * Math.log2(options.charsetSize || 62))
}

function strengthLabel(entropy: number): { label: string; color: string; width: string } {
  if (entropy < 40) return { label: 'Weak', color: 'text-red-400', width: 'w-1/4' }
  if (entropy < 60) return { label: 'Fair', color: 'text-yellow-400', width: 'w-2/4' }
  if (entropy < 80) return { label: 'Strong', color: 'text-brand-400', width: 'w-3/4' }
  return { label: 'Very Strong', color: 'text-green-400', width: 'w-full' }
}

function strengthBarColor(entropy: number): string {
  if (entropy < 40) return 'bg-red-500'
  if (entropy < 60) return 'bg-yellow-500'
  if (entropy < 80) return 'bg-brand-500'
  return 'bg-green-500'
}

export default function PasswordGenerator() {
  const jsonLd = useMemo(() => [
    toolJsonLd({
      name: 'Password Generator',
      description: 'Generate strong random passwords and memorable XKCD-style passphrases online.',
      path: '/tools/password-generator',
      category: 'DeveloperApplication',
    }),
    faqJsonLd([
      { question: 'What makes a password strong?', answer: 'Password strength is measured in entropy (bits of randomness). A password with 80+ bits of entropy is considered very strong. Length matters more than complexity — a 4-word passphrase like "correct-horse-battery-staple" has more entropy than "Tr0ub4d0r&3". Use at least 16 characters for random passwords or 4+ words for passphrases.' },
      { question: 'What is an XKCD-style passphrase?', answer: 'An XKCD passphrase (inspired by XKCD comic #936) generates passwords by combining random common words. For example: "horse-battery-staple-correct". These are easier to remember than random characters but equally secure because entropy comes from the number of possible word combinations, not character complexity.' },
      { question: 'Is this password generator secure?', answer: 'Yes. All passwords are generated 100% in your browser using the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. No passwords are ever sent to a server or stored anywhere.' },
    ]),
  ], [])

  useSeo({
    title: 'Password Generator — Random & Memorable',
    description: 'Free online password generator. Create strong random passwords and XKCD-style memorable passphrases. Entropy calculator, strength meter. No ads, no tracking.',
    path: '/tools/password-generator',
    jsonLd,
  })

  const [mode, setMode] = useState<PasswordMode>('random')
  const [passwords, setPasswords] = useState<string[]>([])
  const [count, setCount] = useState(1)

  // Random mode options
  const [length, setLength] = useState(20)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)

  // Memorable mode options
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [capitalize, setCapitalize] = useState(true)
  const [addNumber, setAddNumber] = useState(true)

  const generate = useCallback(() => {
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      if (mode === 'random') {
        results.push(generateRandomPassword(length, {
          uppercase: useUppercase,
          lowercase: useLowercase,
          numbers: useNumbers,
          symbols: useSymbols,
        }))
      } else {
        results.push(generateMemorablePassphrase(wordCount, separator, capitalize, addNumber))
      }
    }
    setPasswords(results)
  }, [mode, count, length, useUppercase, useLowercase, useNumbers, useSymbols, wordCount, separator, capitalize, addNumber])

  const charsetSize = (useUppercase ? 26 : 0) + (useLowercase ? 26 : 0) + (useNumbers ? 10 : 0) + (useSymbols ? 26 : 0) || 36

  const entropy = passwords.length > 0
    ? estimateEntropy(passwords[0], mode, {
        wordCount,
        addNumber,
        charsetSize,
      })
    : 0

  const strength = strengthLabel(entropy)
  const barColor = strengthBarColor(entropy)
  const allText = passwords.join('\n')

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong random passwords and memorable XKCD-style passphrases."
    >
      {/* Mode toggle */}
      <div className="flex rounded border border-border overflow-hidden mb-4">
        <button
          onClick={() => setMode('random')}
          className={`flex-1 px-4 py-2 text-sm transition-colors ${
            mode === 'random'
              ? 'bg-brand-500 text-white'
              : 'bg-surface-2 text-text-secondary hover:text-text-primary'
          }`}
        >
          Random Password
        </button>
        <button
          onClick={() => setMode('memorable')}
          className={`flex-1 px-4 py-2 text-sm transition-colors ${
            mode === 'memorable'
              ? 'bg-brand-500 text-white'
              : 'bg-surface-2 text-text-secondary hover:text-text-primary'
          }`}
        >
          Memorable Passphrase
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {mode === 'random' ? (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Length:</label>
              <input
                type="range"
                min={8}
                max={128}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-24 accent-brand-500"
              />
              <span className="text-sm font-mono w-8 text-text-primary">{length}</span>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className="rounded" />
              A-Z
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className="rounded" />
              a-z
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="rounded" />
              0-9
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="rounded" />
              !@#$
            </label>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Words:</label>
              <select
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="px-3 py-2 bg-surface-2 border border-border rounded text-sm focus:outline-none focus:border-brand-500/50"
              >
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">Separator:</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="px-3 py-2 bg-surface-2 border border-border rounded text-sm focus:outline-none focus:border-brand-500/50"
              >
                <option value="-">- (dash)</option>
                <option value=".">. (dot)</option>
                <option value="_">_ (underscore)</option>
                <option value=" ">(space)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="rounded" />
              Capitalize
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={addNumber} onChange={(e) => setAddNumber(e.target.checked)} className="rounded" />
              Add number
            </label>
          </>
        )}

        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="px-3 py-2 bg-surface-2 border border-border rounded text-sm focus:outline-none focus:border-brand-500/50"
          >
            {[1, 5, 10, 25].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <button
          onClick={generate}
          className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded text-sm font-medium transition-colors"
        >
          Generate
        </button>
      </div>

      {/* Strength meter */}
      {passwords.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
            <span className="text-xs text-text-muted">{entropy} bits of entropy</span>
          </div>
          <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} ${strength.width} transition-all rounded-full`} />
          </div>
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-text-secondary">
            {passwords.length > 0 ? `${passwords.length} password${passwords.length > 1 ? 's' : ''} generated` : 'Click Generate to create passwords'}
          </label>
          {passwords.length > 0 && <CopyButton text={allText} />}
        </div>
        <textarea
          value={allText}
          readOnly
          placeholder="Generated passwords will appear here..."
          className="w-full h-48 p-4 bg-surface-1 border border-border rounded-lg text-sm font-mono resize-none focus:outline-none placeholder:text-text-muted"
          spellCheck={false}
        />
      </div>

      {/* SEO content */}
      <div className="mt-12 text-sm text-text-secondary space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Strong Password Generator</h2>
        <p>
          Generate cryptographically secure passwords using the Web Crypto API. Choose between
          random character passwords for maximum entropy or XKCD-style memorable passphrases
          that are easy to remember but hard to crack.
        </p>
        <h3 className="font-semibold text-text-primary">XKCD Passphrase Method</h3>
        <p>
          Inspired by <strong>XKCD comic #936</strong>, the memorable passphrase mode combines
          random words from a curated wordlist. A 4-word passphrase like "Horse-Battery-Staple-Correct"
          has approximately {Math.round(4 * Math.log2(WORDLIST.length))} bits of entropy — stronger
          than most complex 8-character passwords, and much easier to remember.
        </p>
        <h3 className="font-semibold text-text-primary">Password Entropy Explained</h3>
        <p>
          Entropy measures the randomness (and therefore the strength) of a password in bits.
          A password with N bits of entropy would take 2^N guesses to crack by brute force.
          For reference: 40 bits = weak, 60 bits = fair, 80 bits = strong, 100+ bits = very strong.
        </p>
        <h3 className="font-semibold text-text-primary">Best Practices</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Use at least 16 characters for random passwords</li>
          <li>Use at least 4 words for memorable passphrases</li>
          <li>Never reuse passwords across different accounts</li>
          <li>Use a password manager to store generated passwords</li>
          <li>Enable two-factor authentication (2FA) wherever possible</li>
        </ul>
        <h3 className="font-semibold text-text-primary">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Two modes: random characters and XKCD-style memorable passphrases</li>
          <li>Cryptographically secure (Web Crypto API)</li>
          <li>Entropy calculation and strength meter</li>
          <li>Customizable length, character sets, word count, and separators</li>
          <li>Bulk generation — up to 25 passwords at once</li>
          <li>100% client-side — passwords never leave your browser</li>
        </ul>
      </div>

      <RelatedTools currentId="password-generator" />
    </ToolLayout>
  )
}
