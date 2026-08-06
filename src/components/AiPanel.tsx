import { useState } from 'react'

type Mode = { id: string; label: string; system: string; instruct: (t: string) => string }

const MODES: Mode[] = [
  {
    id: 'grammar',
    label: 'Fix grammar',
    system: 'You are a meticulous copy editor. Fix grammar, spelling, punctuation. Preserve meaning, voice, and formatting. Output ONLY the corrected text, nothing else.',
    instruct: (t) => t,
  },
  {
    id: 'summarize',
    label: 'Summarize',
    system: 'You are a precise summarizer. Produce a tight summary. Output ONLY the summary.',
    instruct: (t) => t,
  },
  {
    id: 'rewrite',
    label: 'Rewrite',
    system: 'You are a skilled editor. Rewrite the text to be clearer and stronger while keeping its meaning. Output ONLY the rewritten text.',
    instruct: (t) => t,
  },
  {
    id: 'formal',
    label: 'Formal tone',
    system: 'Rewrite the text in a formal, professional tone. Output ONLY the rewritten text.',
    instruct: (t) => t,
  },
  {
    id: 'casual',
    label: 'Casual tone',
    system: 'Rewrite the text in a friendly, casual tone. Output ONLY the rewritten text.',
    instruct: (t) => t,
  },
  {
    id: 'translate',
    label: 'Translate →',
    system: 'You are a professional translator. Translate the text into the requested language, preserving tone. Output ONLY the translation.',
    instruct: (t) => t,
  },
]

const LANGS = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Arabic', 'Chinese']

export function AiPanel({
  text,
  onReplace,
  onNotify,
}: {
  text: string
  onReplace: (v: string) => void
  onNotify: (m: string) => void
}) {
  const [busy, setBusy] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState('English')

  const run = async (m: Mode) => {
    if (!text.trim()) return
    setBusy(m.id)
    setError(null)
    setResult(null)
    try {
      // Lazy-load the AI package only on first use — keeps initial JS tiny.
      const { complete } = await import('@chirag127/oz-ai')
      const sys = m.id === 'translate' ? `${m.system} Target language: ${lang}.` : m.system
      const out = await complete(m.instruct(text), { system: sys, temperature: 0.4 })
      setResult(out.trim())
    } catch {
      setError('All AI providers are busy. Core tools still work — try again in a moment.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="ai" aria-label="AI assist">
      <header className="ai__head">
        <h2>Editor’s desk <span className="ai__badge">AI</span></h2>
        <p className="ai__hint">Optional polish. Loads on first use. Core tools never need it.</p>
      </header>

      <div className="ai__row">
        {MODES.map((m) => (
          <button
            key={m.id}
            className="op-chip ink-btn"
            disabled={!text.trim() || busy !== null}
            onClick={() => run(m)}
          >
            {busy === m.id ? '…thinking' : m.label}
          </button>
        ))}
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Translate target language">
          {LANGS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {busy && <p className="ai__status" role="status">Consulting the editor… providers auto-fail-over.</p>}
      {error && <p className="err" role="alert">{error}</p>}

      {result !== null && (
        <div className="ai__result">
          <pre className="ai__out">{result}</pre>
          <div className="ai__actions">
            <button className="ink-btn primary" onClick={() => { onReplace(result); onNotify('Replaced with AI result'); setResult(null) }}>
              Use this
            </button>
            <button className="ink-btn" onClick={() => { navigator.clipboard?.writeText(result); onNotify('Copied AI result') }}>
              Copy
            </button>
            <button className="ink-btn" onClick={() => setResult(null)}>Dismiss</button>
          </div>
        </div>
      )}
    </section>
  )
}
