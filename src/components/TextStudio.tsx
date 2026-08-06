import { useCallback, useMemo, useRef, useState } from 'react'
import {
  count,
  dedupeLines,
  findReplace,
  lorem,
  removeBlankLines,
  removeExtraSpaces,
  reverseChars,
  reverseLines,
  reverseWords,
  shuffleLines,
  slugify,
  sortLines,
  toCamel,
  toConstant,
  toKebab,
  toLower,
  toPascal,
  toSentence,
  toSnake,
  toTitle,
  toggleCase,
  toUpper,
  trimLines,
} from '../lib/text'
import { Meter } from './Meter'
import { AiPanel } from './AiPanel'

type Op = { id: string; label: string; run: (s: string) => string; group: string }

const OPS: Op[] = [
  { id: 'upper', label: 'UPPERCASE', run: toUpper, group: 'Case' },
  { id: 'lower', label: 'lowercase', run: toLower, group: 'Case' },
  { id: 'title', label: 'Title Case', run: toTitle, group: 'Case' },
  { id: 'sentence', label: 'Sentence case', run: toSentence, group: 'Case' },
  { id: 'toggle', label: 'tOGGLE cASE', run: toggleCase, group: 'Case' },
  { id: 'camel', label: 'camelCase', run: toCamel, group: 'Programmer' },
  { id: 'pascal', label: 'PascalCase', run: toPascal, group: 'Programmer' },
  { id: 'snake', label: 'snake_case', run: toSnake, group: 'Programmer' },
  { id: 'kebab', label: 'kebab-case', run: toKebab, group: 'Programmer' },
  { id: 'constant', label: 'CONSTANT_CASE', run: toConstant, group: 'Programmer' },
  { id: 'slug', label: 'Slugify', run: (s) => slugify(s), group: 'Programmer' },
  { id: 'trim', label: 'Trim lines', run: trimLines, group: 'Whitespace' },
  { id: 'spaces', label: 'Remove extra spaces', run: removeExtraSpaces, group: 'Whitespace' },
  { id: 'blank', label: 'Remove blank lines', run: removeBlankLines, group: 'Whitespace' },
  { id: 'sort', label: 'Sort A→Z', run: (s) => sortLines(s), group: 'Lines' },
  { id: 'sortDesc', label: 'Sort Z→A', run: (s) => sortLines(s, { descending: true }), group: 'Lines' },
  { id: 'sortNum', label: 'Sort numeric', run: (s) => sortLines(s, { numeric: true }), group: 'Lines' },
  { id: 'dedupe', label: 'Dedupe lines', run: (s) => dedupeLines(s), group: 'Lines' },
  { id: 'revLines', label: 'Reverse lines', run: reverseLines, group: 'Lines' },
  { id: 'shuffle', label: 'Shuffle lines', run: (s) => shuffleLines(s), group: 'Lines' },
  { id: 'revChars', label: 'Reverse chars', run: reverseChars, group: 'Reverse' },
  { id: 'revWords', label: 'Reverse words', run: reverseWords, group: 'Reverse' },
]

const SAMPLE = `The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
A wizard's job is to vex chumps quickly in fog.

Pack my box with five dozen liquor jugs.`

const GROUPS = ['Case', 'Programmer', 'Whitespace', 'Lines', 'Reverse']

export default function TextStudio() {
  const [text, setText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [flash, setFlash] = useState<string | null>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const counts = useMemo(() => count(text), [text])

  const apply = useCallback(
    (op: Op) => {
      setText((cur) => {
        setHistory((h) => [...h, cur])
        return op.run(cur)
      })
    },
    [],
  )

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]
      setText(prev)
      return h.slice(0, -1)
    })
  }, [])

  const notify = (m: string) => {
    setFlash(m)
    window.clearTimeout((notify as any)._t)
    ;(notify as any)._t = window.setTimeout(() => setFlash(null), 1600)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      notify('Copied to clipboard')
    } catch {
      notify('Copy failed — select + Ctrl+C')
    }
  }

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'text.txt'
    a.click()
    URL.revokeObjectURL(url)
    notify('Downloaded text.txt')
  }

  const clear = () => {
    setHistory((h) => [...h, text])
    setText('')
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    setHistory((h) => [...h, text])
    setText(await f.text())
    notify(`Loaded ${f.name}`)
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setHistory((h) => [...h, text])
    setText(await f.text())
    notify(`Loaded ${f.name}`)
    e.target.value = ''
  }

  return (
    <div className="studio measure">
      <div
        className="manuscript"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="editor-wrap">
          <textarea
            ref={taRef}
            className="editor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Begin typing, paste, or drop a .txt file here…"
            spellCheck={false}
            aria-label="Text editor"
          />
        </div>
        <Meter counts={counts} />
      </div>

      <div className="deskbar" role="toolbar" aria-label="Text actions">
        <button className="ink-btn primary" onClick={copy} disabled={!text}>Copy</button>
        <button className="ink-btn" onClick={download} disabled={!text}>Download .txt</button>
        <label className="ink-btn file">
          Open file
          <input type="file" accept=".txt,.md,.csv,.json,text/*" onChange={onFile} hidden />
        </label>
        <button className="ink-btn" onClick={() => { setHistory((h) => [...h, text]); setText(SAMPLE) }}>Sample</button>
        <button className="ink-btn" onClick={undo} disabled={history.length === 0}>Undo</button>
        <button className="ink-btn danger" onClick={clear} disabled={!text}>Clear</button>
        {flash && <span className="flash" role="status">{flash}</span>}
      </div>

      <div className="ops">
        {GROUPS.map((g) => (
          <fieldset className="op-group" key={g}>
            <legend>{g}</legend>
            <div className="op-row">
              {OPS.filter((o) => o.group === g).map((o) => (
                <button key={o.id} className="op-chip ink-btn" onClick={() => apply(o)} disabled={!text}>
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
        <LoremTool onInsert={(v) => { setHistory((h) => [...h, text]); setText((t) => (t ? t + '\n\n' + v : v)) }} />
        <ReplaceTool text={text} onApply={(v) => { setHistory((h) => [...h, text]); setText(v) }} onNotify={notify} />
      </div>

      <AiPanel text={text} onReplace={(v) => { setHistory((h) => [...h, text]); setText(v) }} onNotify={notify} />
    </div>
  )
}

function LoremTool({ onInsert }: { onInsert: (v: string) => void }) {
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [n, setN] = useState(3)
  return (
    <fieldset className="op-group">
      <legend>Lorem ipsum</legend>
      <div className="op-row inline">
        <input
          type="number"
          min={1}
          max={100}
          value={n}
          onChange={(e) => setN(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
          aria-label="Amount"
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value as any)} aria-label="Unit">
          <option value="paragraphs">paragraphs</option>
          <option value="sentences">sentences</option>
          <option value="words">words</option>
        </select>
        <button className="op-chip ink-btn" onClick={() => onInsert(lorem({ unit, count: n }))}>
          Insert
        </button>
      </div>
    </fieldset>
  )
}

function ReplaceTool({
  text,
  onApply,
  onNotify,
}: {
  text: string
  onApply: (v: string) => void
  onNotify: (m: string) => void
}) {
  const [find, setFind] = useState('')
  const [repl, setRepl] = useState('')
  const [regex, setRegex] = useState(false)
  const [ci, setCi] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const run = () => {
    setErr(null)
    try {
      const r = findReplace(text, find, repl, { regex, caseInsensitive: ci })
      onApply(r.text)
      onNotify(`Replaced ${r.count}`)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Invalid pattern')
    }
  }

  return (
    <fieldset className="op-group replace">
      <legend>Find &amp; replace</legend>
      <div className="op-row inline wrap">
        <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="find" aria-label="Find" />
        <input value={repl} onChange={(e) => setRepl(e.target.value)} placeholder="replace" aria-label="Replace" />
        <label className="tick"><input type="checkbox" checked={regex} onChange={(e) => setRegex(e.target.checked)} /> regex</label>
        <label className="tick"><input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> ignore case</label>
        <button className="op-chip ink-btn" onClick={run} disabled={!text || !find}>Replace all</button>
      </div>
      {err && <p className="err">{err}</p>}
    </fieldset>
  )
}
