import { useMemo, useState } from 'react'
import {
  groupOrder,
  keywordsByGroup,
  personas,
  personaMap,
} from '~/lib/find/keywords'
import { areas, commuteTargets, dataIsProvisional, sigunguOf } from '~/lib/find/regions'
import { findAreas } from '~/lib/find/score'
import { dealLabels, type DealType, type KeywordId, type PersonaId } from '~/lib/find/types'
import { won, wonShort } from '~/lib/format'

const 억 = 100_000_000
const 만 = 10_000

const dealRange: Record<DealType, { max: number; step: number; low: number; high: number }> = {
  jeonse: { max: 8 * 억, step: 500 * 만, low: 8000 * 만, high: 1.2 * 억 },
  monthly: { max: 1 * 억, step: 100 * 만, low: 500 * 만, high: 3000 * 만 },
  sale: { max: 15 * 억, step: 1000 * 만, low: 3 * 억, high: 5 * 억 },
}

const SIDO = '대전광역시'
const SHOW = 8

export default function Find() {
  const [persona, setPersona] = useState<PersonaId | null>(null)
  const [selected, setSelected] = useState<Set<KeywordId>>(new Set())
  const [deal, setDeal] = useState<DealType>('jeonse')
  const [min, setMin] = useState(dealRange.jeonse.low)
  const [max, setMax] = useState(dealRange.jeonse.high)
  const [sigungu, setSigungu] = useState<string | null>(null)
  const [commuteTo, setCommuteTo] = useState<string | null>(null)

  const guList = sigunguOf(SIDO)
  const targets = commuteTargets[SIDO] ?? []

  function choosePersona(id: PersonaId) {
    const next = personaMap.get(id)
    if (!next) return
    setPersona(id)
    setSelected(new Set(next.keywords))
  }

  function toggle(id: KeywordId) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function changeDeal(d: DealType) {
    setDeal(d)
    setMin(dealRange[d].low)
    setMax(dealRange[d].high)
  }

  const hits = useMemo(() => {
    if (selected.size === 0) return []
    return findAreas(areas, {
      sido: SIDO,
      sigungu,
      deal,
      min: Math.min(min, max),
      max: Math.max(min, max),
      keywords: [...selected],
      commuteTo,
    })
  }, [selected, sigungu, deal, min, max, commuteTo])

  const fitting = hits.filter((h) => h.priceFits)
  const needsTarget = selected.has('commute') && !commuteTo

  return (
    <div>
      {dataIsProvisional && (
        <div className="callout" role="note">
          <p>
            <strong>지금은 예시 자료로 움직입니다.</strong> 동네 이름은 실제 대전의
            동이지만, 값과 거리는 아직 채워 넣은 임시 숫자입니다. 실거래가와 시설
            자료를 붙이면 이 자리에 실제 숫자가 들어갑니다.
          </p>
        </div>
      )}

      {/* 1. 어떤 사람인지 */}
      <fieldset className="field chips-field">
        <legend>어떤 때인가요?</legend>
        <p className="field-help">
          고르면 그런 상황에서 많이 보는 조건이 미리 켜집니다. 그다음 끄고 켜면 됩니다.
        </p>
        <div className="chips">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              aria-pressed={persona === p.id}
              onClick={() => choosePersona(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {persona && <p className="field-help" style={{ marginTop: '0.6rem' }}>{personaMap.get(persona)?.blurb}</p>}
      </fieldset>

      {/* 2. 조건 */}
      <fieldset className="field chips-field">
        <legend>중요하게 볼 것 ({selected.size}개)</legend>
        <p className="field-help">
          눌러서 켜고 끕니다. 몇 개를 골라도 되고, 하나만 골라도 됩니다.
        </p>
        {groupOrder.map((g) => (
          <div key={g}>
            <p className="chip-group-title">{g}</p>
            <div className="chips">
              {keywordsByGroup(g).map((k) => {
                const on = selected.has(k.id)
                return (
                  <button
                    key={k.id}
                    type="button"
                    className="chip"
                    aria-pressed={on}
                    title={k.help}
                    onClick={() => toggle(k.id)}
                  >
                    <Mark on={on} />
                    {k.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </fieldset>

      {/* 목적지 */}
      {selected.has('commute') && (
        <div className="field">
          <label className="field-label" htmlFor="commute-to">
            어디까지 오가나요?
          </label>
          <select
            id="commute-to"
            value={commuteTo ?? ''}
            onChange={(e) => setCommuteTo(e.target.value || null)}
          >
            <option value="">고르지 않음</option>
            {targets.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {needsTarget && (
            <p className="field-help" style={{ marginTop: '0.5rem' }}>
              목적지를 골라야 걸리는 시간을 볼 수 있습니다.
            </p>
          )}
        </div>
      )}

      {/* 3. 값 */}
      <fieldset className="field">
        <legend>어떻게, 얼마에</legend>
        <div className="chips" style={{ marginBottom: '1rem' }}>
          {(Object.keys(dealLabels) as DealType[]).map((d) => (
            <button
              key={d}
              type="button"
              className="chip"
              aria-pressed={deal === d}
              onClick={() => changeDeal(d)}
            >
              {dealLabels[d]}
            </button>
          ))}
        </div>

        <RangeRow
          label={deal === 'monthly' ? '보증금 가장 적게' : '가장 적게'}
          value={min}
          max={dealRange[deal].max}
          step={dealRange[deal].step}
          onChange={setMin}
        />
        <RangeRow
          label={deal === 'monthly' ? '보증금 가장 많이' : '가장 많이'}
          value={max}
          max={dealRange[deal].max}
          step={dealRange[deal].step}
          onChange={setMax}
        />
        <p className="field-help" style={{ marginTop: '0.6rem' }}>
          {won(Math.min(min, max))} ~ {won(Math.max(min, max))} 사이를 봅니다.
        </p>
      </fieldset>

      {/* 4. 지역 */}
      <div className="field">
        <label className="field-label" htmlFor="gu">
          어느 쪽에서 찾나요?
        </label>
        <select id="gu" value={sigungu ?? ''} onChange={(e) => setSigungu(e.target.value || null)}>
          <option value="">대전 전체</option>
          {guList.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <hr />

      {/* 결과 */}
      <h2 style={{ marginTop: 0 }}>맞는 동네</h2>

      {selected.size === 0 ? (
        <div className="empty">
          위에서 중요하게 볼 것을 하나 이상 골라 주세요.
        </div>
      ) : (
        <>
          <p className="field-help">
            {fitting.length > 0
              ? `값이 맞는 곳 ${fitting.length}곳을 조건에 잘 맞는 순서로 보여 줍니다.`
              : '고른 값 범위에 맞는 동네가 없어서, 조건만 맞는 곳을 보여 줍니다. 값 범위를 넓혀 보세요.'}
          </p>

          {hits.slice(0, SHOW).map((h) => {
            const band = h.area.price[deal]
            return (
              <article className="hit" key={h.area.id}>
                <div className="hit-head">
                  <span className="hit-name">
                    {h.area.sigungu} {h.area.dong}
                  </span>
                  <span className="hit-where">
                    {h.known}개 확인 {h.unknown > 0 ? `· ${h.unknown}개 자료 없음` : ''}
                  </span>
                  <span className="hit-score">{h.score}점</span>
                </div>

                <p className="hit-price">
                  {dealLabels[deal]}{' '}
                  {band ? `${wonShort(band.low)} ~ ${wonShort(band.high)}` : '자료 없음'}
                  {!h.priceFits && (
                    <span className="hit-where"> — 고른 값 범위 밖입니다</span>
                  )}
                </p>

                <ul className="tags">
                  {h.verdicts.map((v) => (
                    <li
                      key={v.id}
                      className={v.score === null ? 'tag-miss' : v.score >= 0.6 ? 'tag-hit' : 'tag-miss'}
                    >
                      {v.detail || v.label}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </>
      )}
    </div>
  )
}

function RangeRow({
  label,
  value,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  const id = `r-${label}`
  return (
    <div className="slider">
      <div className="slider-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="num">
          {wonShort(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

/** 켜진 조건 앞에 붙는 표시. 이모지 대신 그린다. */
function Mark({ on }: { on: boolean }) {
  if (!on) return null
  return (
    <svg className="mark" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
