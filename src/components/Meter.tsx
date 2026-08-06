import type { Counts } from '../lib/text'

function fmt(n: number): string {
  return n.toLocaleString()
}

function readTime(sec: number): string {
  if (sec < 1) return '0s'
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s ? `${m}m ${s}s` : `${m}m`
}

/**
 * Signature element: a typewriter tally bar that ticks live as you write.
 * A metal carriage rule under the editor — the writing-desk word counter.
 */
export function Meter({ counts }: { counts: Counts }) {
  const stats: [string, string][] = [
    ['words', fmt(counts.words)],
    ['chars', fmt(counts.chars)],
    ['no spaces', fmt(counts.charsNoSpaces)],
    ['lines', fmt(counts.lines)],
    ['sentences', fmt(counts.sentences)],
    ['paragraphs', fmt(counts.paragraphs)],
    ['read', readTime(counts.readingSeconds)],
  ]
  return (
    <div className="meter" aria-label="Live text statistics">
      <span className="meter__bell" aria-hidden="true">◖</span>
      <dl className="meter__stats">
        {stats.map(([k, v]) => (
          <div className="meter__stat" key={k}>
            <dd key={v} className="meter__num">{v}</dd>
            <dt className="meter__key">{k}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
