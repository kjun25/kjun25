/**
 * 용어 화면에서 같이 쓰는 조각들.
 *
 * 규칙: 만지면 그 자리에서 숫자가 움직인다. 설명을 읽고 이해하는 게 아니라
 * 당겨 보고 이해하게 만든다. 수학눈이 그래프에 했던 것과 같다.
 */
import type { ReactNode } from 'react'
import { wonShort } from '~/lib/format'

export function Panel({ children }: { children: ReactNode }) {
  return <div className="panel">{children}</div>
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = wonShort,
  hint,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
  hint?: string
}) {
  const id = `s-${label.replace(/\s/g, '')}`
  return (
    <div className="slider">
      <div className="slider-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="num">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint ? <p className="slider-hint">{hint}</p> : null}
    </div>
  )
}

export function Result({
  label,
  value,
  tone = 'plain',
  sub,
}: {
  label: string
  value: string
  tone?: 'plain' | 'ok' | 'warn' | 'danger'
  sub?: string
}) {
  return (
    <div className={`result tone-${tone}`}>
      <span className="result-label">{label}</span>
      <strong className="result-value num">{value}</strong>
      {sub ? <span className="result-sub">{sub}</span> : null}
    </div>
  )
}

/**
 * 두 값을 길이로 비교하는 막대. 인라인 SVG라 네트워크 요청이 없고
 * 어두운 화면에서도 색이 알아서 바뀐다.
 */
export function CompareBar({
  total,
  parts,
  height = 46,
}: {
  total: number
  parts: { label: string; value: number; tone: 'a' | 'b' }[]
  height?: number
}) {
  const safeTotal = total > 0 ? total : 1
  let x = 0
  return (
    <div className="scroll-x">
      <svg
        className="compare"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={parts
          .map((p) => `${p.label} ${Math.round((p.value / safeTotal) * 100)}%`)
          .join(', ')}
      >
        {parts.map((p) => {
          const w = Math.max(0, (p.value / safeTotal) * 100)
          const rect = (
            <rect
              key={p.label}
              x={x}
              y={0}
              width={w}
              height={height}
              className={`seg seg-${p.tone}`}
            />
          )
          x += w
          return rect
        })}
      </svg>
    </div>
  )
}

export function Legend({
  items,
}: {
  items: { label: string; value: string; tone: 'a' | 'b' }[]
}) {
  return (
    <ul className="legend">
      {items.map((i) => (
        <li key={i.label}>
          <span className={`dot dot-${i.tone}`} aria-hidden="true" />
          <span className="legend-label">{i.label}</span>
          <span className="num legend-value">{i.value}</span>
        </li>
      ))}
    </ul>
  )
}

/** 화면에 늘 붙는 한 줄. 조언이 아니라 사실만 적는다. */
export function Says({ children }: { children: ReactNode }) {
  return <p className="says">{children}</p>
}
