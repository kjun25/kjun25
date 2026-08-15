import test from 'node:test'
import assert from 'node:assert/strict'
import { judge, priceFits, scoreArea, findAreas } from '../src/lib/find/score.ts'
import type { Area, Query } from '../src/lib/find/types.ts'

const 억 = 100_000_000

function area(over: Partial<Area> = {}): Area {
  return {
    id: 'test',
    sido: '대전광역시',
    sigungu: '유성구',
    dong: '지족동',
    price: { jeonse: { low: 2 * 억, high: 3 * 억 } },
    facts: {},
    provenance: {},
    ...over,
  }
}

function query(over: Partial<Query> = {}): Query {
  return {
    sido: '대전광역시',
    sigungu: null,
    deal: 'jeonse',
    min: 2 * 억,
    max: 3 * 억,
    keywords: [],
    commuteTo: null,
    ...over,
  }
}

test('모르는 것은 0점이 아니라 null이다', () => {
  const v = judge('subway', area(), query(), 2026)
  assert.equal(v.score, null)
  assert.equal(v.detail, '자료 없음')
})

test('가까울수록 점수가 높다', () => {
  const near = judge('subway', area({ facts: { subwayMin: 4 } }), query(), 2026)
  const far = judge('subway', area({ facts: { subwayMin: 18 } }), query(), 2026)
  assert.equal(near.score, 1)
  assert.ok(far.score !== null && far.score < near.score!)
})

test('아주 멀면 0점이다', () => {
  const v = judge('subway', area({ facts: { subwayMin: 40 } }), query(), 2026)
  assert.equal(v.score, 0)
})

test('목적지를 안 고르면 오가는 시간은 모르는 것으로 둔다', () => {
  const a = area({ facts: { commuteMin: { 대전시청: 20 } } })
  assert.equal(judge('commute', a, query(), 2026).score, null)
  assert.equal(judge('commute', a, query({ commuteTo: '대전시청' }), 2026).score, 1)
})

test('지은 해는 그 해가 아니라 나이로 본다', () => {
  const a = area({ facts: { builtYearMedian: 2022 } })
  assert.equal(judge('newbuild', a, query(), 2026).score, 1)
  assert.equal(judge('newbuild', a, query(), 2056).score, 0)
})

test('값 범위가 겹치기만 하면 맞는 것으로 본다', () => {
  const a = area({ price: { jeonse: { low: 2 * 억, high: 3 * 억 } } })
  assert.equal(priceFits(a, query({ min: 2.9 * 억, max: 5 * 억 })), true)
  assert.equal(priceFits(a, query({ min: 3.1 * 억, max: 5 * 억 })), false)
  assert.equal(priceFits(a, query({ deal: 'sale' })), false)
})

test('모르는 조건은 평균에서 빼고 계산한다', () => {
  const a = area({ facts: { subwayMin: 4 } })
  const hit = scoreArea(a, query({ keywords: ['subway', 'park'] }), 2026)
  assert.equal(hit.score, 100)
  assert.equal(hit.known, 1)
  assert.equal(hit.unknown, 1)
})

test('아는 게 하나도 없으면 0점이다', () => {
  const hit = scoreArea(area(), query({ keywords: ['subway'] }), 2026)
  assert.equal(hit.score, 0)
  assert.equal(hit.known, 0)
})

test('값이 맞는 곳이 먼저 나오고, 안 맞는 곳도 지우지 않는다', () => {
  const cheapGood = area({
    id: 'a',
    dong: '값맞음',
    price: { jeonse: { low: 2 * 억, high: 3 * 억 } },
    facts: { subwayMin: 20 },
  })
  const pricyPerfect = area({
    id: 'b',
    dong: '값안맞음',
    price: { jeonse: { low: 9 * 억, high: 10 * 억 } },
    facts: { subwayMin: 2 },
  })

  const out = findAreas([pricyPerfect, cheapGood], query({ keywords: ['subway'] }), 2026)
  assert.equal(out.length, 2, '안 맞는 곳도 목록에 남아야 한다')
  assert.equal(out[0]!.area.id, 'a', '값이 맞는 곳이 먼저 나와야 한다')
  assert.equal(out[1]!.priceFits, false)
})

test('구를 고르면 그 구만 본다', () => {
  const yuseong = area({ id: 'y', sigungu: '유성구', facts: { subwayMin: 5 } })
  const seogu = area({ id: 's', sigungu: '서구', facts: { subwayMin: 5 } })
  const out = findAreas([yuseong, seogu], query({ sigungu: '서구', keywords: ['subway'] }), 2026)
  assert.equal(out.length, 1)
  assert.equal(out[0]!.area.id, 's')
})
