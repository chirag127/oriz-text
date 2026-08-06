// Pure text transforms. Zero deps. Tested in text.test.ts.

export function toUpper(s: string): string {
  return s.toUpperCase()
}

export function toLower(s: string): string {
  return s.toLowerCase()
}

export function toTitle(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

export function toSentence(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase())
}

export function toCamel(s: string): string {
  const w = words(s)
  return w.map((x, i) => (i === 0 ? x.toLowerCase() : cap(x))).join('')
}

export function toPascal(s: string): string {
  return words(s).map(cap).join('')
}

export function toSnake(s: string): string {
  return words(s).map((x) => x.toLowerCase()).join('_')
}

export function toKebab(s: string): string {
  return words(s).map((x) => x.toLowerCase()).join('-')
}

export function toConstant(s: string): string {
  return words(s).map((x) => x.toUpperCase()).join('_')
}

export function toggleCase(s: string): string {
  return s.replace(/[a-zA-Z]/g, (c) =>
    c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase(),
  )
}

function cap(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
}

/** Split any string into word tokens (handles camelCase, snake, kebab, spaces). */
export function words(s: string): string[] {
  return (
    s
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
  )
}

// --- counting ---

export interface Counts {
  chars: number
  charsNoSpaces: number
  words: number
  lines: number
  sentences: number
  paragraphs: number
  readingSeconds: number
}

export function count(s: string): Counts {
  const chars = [...s].length
  const charsNoSpaces = [...s.replace(/\s/g, '')].length
  const wordArr = s.trim() ? s.trim().split(/\s+/) : []
  const w = wordArr.length
  const lines = s === '' ? 0 : s.split(/\r\n|\r|\n/).length
  const sentences = (s.match(/[^.!?]+[.!?]+/g) || []).filter((x) => x.trim()).length
  const paragraphs = s.trim() ? s.trim().split(/\n\s*\n/).filter((p) => p.trim()).length : 0
  const readingSeconds = Math.round((w / 200) * 60)
  return { chars, charsNoSpaces, words: w, lines, sentences, paragraphs, readingSeconds }
}

// --- line ops ---

export interface DedupeOptions {
  caseInsensitive?: boolean
  trim?: boolean
  keep?: 'first' | 'last'
}

export function dedupeLines(s: string, opts: DedupeOptions = {}): string {
  const lines = s.split('\n')
  const seen = new Set<string>()
  const out: string[] = []
  const src = opts.keep === 'last' ? [...lines].reverse() : lines
  for (const line of src) {
    let key = opts.trim ? line.trim() : line
    if (opts.caseInsensitive) key = key.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(line)
  }
  if (opts.keep === 'last') out.reverse()
  return out.join('\n')
}

export interface SortOptions {
  numeric?: boolean
  caseInsensitive?: boolean
  descending?: boolean
  removeEmpty?: boolean
}

export function sortLines(s: string, opts: SortOptions = {}): string {
  let lines = s.split('\n')
  if (opts.removeEmpty) lines = lines.filter((l) => l.trim() !== '')
  const collator = new Intl.Collator(undefined, {
    numeric: opts.numeric,
    sensitivity: opts.caseInsensitive ? 'base' : 'variant',
  })
  lines.sort((a, b) => collator.compare(a, b))
  if (opts.descending) lines.reverse()
  return lines.join('\n')
}

export function reverseLines(s: string): string {
  return s.split('\n').reverse().join('\n')
}

export function shuffleLines(s: string, rand: () => number = Math.random): string {
  const lines = s.split('\n')
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[lines[i], lines[j]] = [lines[j], lines[i]]
  }
  return lines.join('\n')
}

// --- whitespace ---

export function removeExtraSpaces(s: string): string {
  return s
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').replace(/^ | $/g, ''))
    .join('\n')
}

export function trimLines(s: string): string {
  return s
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
}

export function removeBlankLines(s: string): string {
  return s
    .split('\n')
    .filter((l) => l.trim() !== '')
    .join('\n')
}

// --- reverse ---

export function reverseChars(s: string): string {
  return [...s].reverse().join('')
}

export function reverseWords(s: string): string {
  return s.split(/(\s+)/).reverse().join('')
}

// --- slugify ---

export interface SlugOptions {
  separator?: string
  lower?: boolean
}

export function slugify(s: string, opts: SlugOptions = {}): string {
  const sep = opts.separator ?? '-'
  const lower = opts.lower ?? true
  let out = s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s-_]+/g, sep)
    .replace(new RegExp(`^${escapeRe(sep)}+|${escapeRe(sep)}+$`, 'g'), '')
  if (lower) out = out.toLowerCase()
  return out
}

// --- find & replace ---

export interface ReplaceOptions {
  regex?: boolean
  caseInsensitive?: boolean
  global?: boolean
  multiline?: boolean
}

export interface ReplaceResult {
  text: string
  count: number
}

export function findReplace(
  s: string,
  find: string,
  replacement: string,
  opts: ReplaceOptions = {},
): ReplaceResult {
  if (find === '') return { text: s, count: 0 }
  let flags = ''
  if (opts.global !== false) flags += 'g'
  if (opts.caseInsensitive) flags += 'i'
  if (opts.multiline) flags += 'm'
  const pattern = opts.regex ? find : escapeRe(find)
  const re = new RegExp(pattern, flags)
  let count = 0
  const text = s.replace(re, (...args) => {
    count++
    if (opts.regex) {
      // support $1 backrefs
      const groups = args.slice(1, -2) as string[]
      return replacement.replace(/\$(\d+)/g, (_, n) => groups[Number(n) - 1] ?? '')
    }
    return replacement
  })
  return { text, count }
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// --- lorem ipsum ---

const LOREM_WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  )

export type LoremUnit = 'paragraphs' | 'sentences' | 'words'

export interface LoremOptions {
  unit?: LoremUnit
  count?: number
  startClassic?: boolean
  rand?: () => number
}

export function lorem(opts: LoremOptions = {}): string {
  const unit = opts.unit ?? 'paragraphs'
  const n = Math.max(1, Math.min(500, opts.count ?? 3))
  const rand = opts.rand ?? Math.random
  const pick = () => LOREM_WORDS[Math.floor(rand() * LOREM_WORDS.length)]

  const makeSentence = (): string => {
    const len = 6 + Math.floor(rand() * 10)
    const ws: string[] = []
    for (let i = 0; i < len; i++) ws.push(pick())
    let sentence = ws.join(' ')
    // sprinkle a comma
    if (len > 8) {
      const at = 3 + Math.floor(rand() * (len - 5))
      const parts = sentence.split(' ')
      parts[at] = parts[at] + ','
      sentence = parts.join(' ')
    }
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  const makeParagraph = (): string => {
    const len = 3 + Math.floor(rand() * 4)
    const ss: string[] = []
    for (let i = 0; i < len; i++) ss.push(makeSentence())
    return ss.join(' ')
  }

  let result: string
  if (unit === 'words') {
    const ws: string[] = []
    for (let i = 0; i < n; i++) ws.push(pick())
    result = ws.join(' ')
    result = result.charAt(0).toUpperCase() + result.slice(1)
  } else if (unit === 'sentences') {
    const ss: string[] = []
    for (let i = 0; i < n; i++) ss.push(makeSentence())
    result = ss.join(' ')
  } else {
    const ps: string[] = []
    for (let i = 0; i < n; i++) ps.push(makeParagraph())
    result = ps.join('\n\n')
  }

  if (opts.startClassic !== false) {
    const classic = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    if (unit === 'words') {
      result = classic
    } else {
      // Replace the first sentence with the classic opener.
      result = result.replace(/^[^.]*\./, classic + '.')
    }
  }
  return result
}

// --- encode helpers (bonus quick ops) ---

export function capitalizeEach(s: string): string {
  return toTitle(s)
}
