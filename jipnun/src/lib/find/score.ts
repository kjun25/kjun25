import { keywordMap } from './keywords.ts'
import type { Area, Hit, KeywordId, KeywordVerdict, Query } from './types.ts'

/**
 * 조건과 동네를 맞춰 보는 계산.
 *
 * 순수 함수로 떼어 둔다. 이 계산 결과가 여러 화면에 그대로 나가기 때문에
 * 여기가 틀리면 모든 화면이 한꺼번에 틀린다. 그래서 따로 시험할 수 있어야 한다.
 *
 * 규칙 하나: 모르는 것은 0점이 아니라 null이다.
 * "안 맞는 동네"와 "아직 자료가 없는 동네"를 같게 다루면 안 된다.
 */

type Band = [threshold: number, score: number]

/** 값이 작을수록 좋은 것 (거리, 시간) */
function lowerBetter(value: number | undefined, bands: Band[]): number | null {
  if (value === undefined || !Number.isFinite(value)) return null
  for (const [limit, score] of bands) {
    if (value <= limit) return score
  }
  return 0
}

/** 값이 클수록 좋은 것 (개수) */
function higherBetter(value: number | undefined, bands: Band[]): number | null {
  if (value === undefined || !Number.isFinite(value)) return null
  for (const [limit, score] of bands) {
    if (value >= limit) return score
  }
  return 0
}

function minutes(v: number | undefined, unit = '분'): string {
  return v === undefined ? '자료 없음' : `${v}${unit}`
}

export function judge(
  id: KeywordId,
  area: Area,
  query: Query,
  thisYear: number
): KeywordVerdict {
  const f = area.facts
  const label = keywordMap.get(id)?.label ?? id

  const make = (score: number | null, detail: string): KeywordVerdict => ({
    id,
    label,
    score,
    detail: score === null ? '자료 없음' : detail,
  })

  switch (id) {
    case 'subway':
      return make(
        lowerBetter(f.subwayMin, [
          [5, 1],
          [10, 0.85],
          [15, 0.5],
          [20, 0.25],
        ]),
        `지하철역까지 걸어서 ${minutes(f.subwayMin)}`
      )

    case 'bus':
      return make(
        lowerBetter(f.busMin, [
          [3, 1],
          [5, 0.85],
          [8, 0.55],
          [12, 0.25],
        ]),
        `버스 정류장까지 걸어서 ${minutes(f.busMin)}`
      )

    case 'commute': {
      const to = query.commuteTo
      if (!to) return make(null, '목적지를 고르지 않았습니다')
      const v = f.commuteMin?.[to]
      return make(
        lowerBetter(v, [
          [20, 1],
          [30, 0.85],
          [40, 0.5],
          [50, 0.25],
        ]),
        `${to}까지 대중교통으로 ${minutes(v)}`
      )
    }

    case 'cafe':
      return make(
        higherBetter(f.cafeCount, [
          [15, 1],
          [8, 0.85],
          [4, 0.6],
          [1, 0.35],
        ]),
        f.cafeCount === undefined
          ? ''
          : `걸어갈 거리에 커피숍 ${f.cafeCount}곳`
      )

    case 'convenience':
      return make(
        higherBetter(f.convenienceCount, [
          [5, 1],
          [3, 0.85],
          [1, 0.55],
        ]),
        f.convenienceCount === undefined
          ? ''
          : `걸어갈 거리에 편의점 ${f.convenienceCount}곳`
      )

    case 'mart':
      return make(
        lowerBetter(f.martMin, [
          [10, 1],
          [20, 0.7],
          [30, 0.4],
        ]),
        `큰 마트까지 ${minutes(f.martMin)}`
      )

    case 'hospital':
      return make(
        lowerBetter(f.hospitalMin, [
          [10, 1],
          [20, 0.75],
          [30, 0.45],
        ]),
        `큰 병원까지 ${minutes(f.hospitalMin)}`
      )

    case 'park':
      return make(
        lowerBetter(f.parkMin, [
          [5, 1],
          [10, 0.85],
          [15, 0.5],
        ]),
        `공원까지 걸어서 ${minutes(f.parkMin)}`
      )

    case 'quiet': {
      const q = f.quietLevel
      const score =
        q === undefined ? null : Math.max(0, Math.min(1, (q - 1) / 4))
      const words = ['', '사람이 아주 많음', '사람이 많음', '보통', '조용함', '아주 조용함']
      return make(score, q === undefined ? '' : `동네 분위기: ${words[q] ?? '보통'}`)
    }

    case 'elementary':
      return make(
        lowerBetter(f.elementaryMin, [
          [5, 1],
          [10, 0.85],
          [15, 0.45],
        ]),
        `초등학교까지 걸어서 ${minutes(f.elementaryMin)}`
      )

    case 'academy':
      return make(
        lowerBetter(f.academyMin, [
          [10, 1],
          [20, 0.7],
          [30, 0.35],
        ]),
        `학원이 모인 곳까지 ${minutes(f.academyMin)}`
      )

    case 'newbuild': {
      const year = f.builtYearMedian
      if (year === undefined) return make(null, '')
      const age = thisYear - year
      return make(
        lowerBetter(age, [
          [5, 1],
          [10, 0.85],
          [20, 0.55],
          [30, 0.3],
        ]),
        `아파트가 많이 지어진 때: ${year}년 무렵`
      )
    }

    case 'parking':
      return make(
        higherBetter(f.parkingPerHousehold, [
          [1.5, 1],
          [1.2, 0.85],
          [1.0, 0.65],
          [0.8, 0.4],
        ]),
        f.parkingPerHousehold === undefined
          ? ''
          : `한 세대에 주차 ${f.parkingPerHousehold.toFixed(1)}대`
      )

    default:
      return make(null, '')
  }
}

export function priceFits(area: Area, query: Query): boolean {
  const band = area.price[query.deal]
  if (!band) return false
  // 값 범위가 겹치기만 하면 맞는 것으로 본다. 동네 안에서도 집마다 다르기 때문이다.
  return band.low <= query.max && band.high >= query.min
}

export function scoreArea(area: Area, query: Query, thisYear: number): Hit {
  const verdicts = query.keywords.map((id) => judge(id, area, query, thisYear))
  const known = verdicts.filter((v) => v.score !== null)
  const unknown = verdicts.length - known.length

  const score =
    known.length === 0
      ? 0
      : Math.round(
          (known.reduce((sum, v) => sum + (v.score ?? 0), 0) / known.length) * 100
        )

  return {
    area,
    score,
    priceFits: priceFits(area, query),
    verdicts,
    known: known.length,
    unknown,
  }
}

/**
 * 조건에 맞는 동네를 순서대로 돌려준다.
 * 값이 안 맞는 곳은 빼지 않고 뒤로 보낸다. "왜 안 나오지"를 없애기 위해서다.
 */
export function findAreas(
  areas: Area[],
  query: Query,
  thisYear = new Date().getFullYear()
): Hit[] {
  return areas
    .filter((a) => a.sido === query.sido)
    .filter((a) => !query.sigungu || a.sigungu === query.sigungu)
    .map((a) => scoreArea(a, query, thisYear))
    .sort((a, b) => {
      if (a.priceFits !== b.priceFits) return a.priceFits ? -1 : 1
      if (b.score !== a.score) return b.score - a.score
      return a.unknown - b.unknown
    })
}
