/**
 * 용어 목록.
 *
 * 검색으로 들어오는 사람이 가장 먼저 만나는 문이라 제목과 한 줄 설명이 곧 상품이다.
 * 프로그래매틱하게 페이지를 늘리기 전에, 여기 있는 몇 개가 색인되는지부터 본다.
 */

export type Term = {
  slug: string
  title: string
  /** 검색 결과와 링크 미리보기에 그대로 나가는 한 문장 */
  summary: string
  /** 사람들이 같이 검색하는 말. 본문에 자연스럽게 들어가야 한다. */
  alsoAsked: string[]
  related: string[]
}

export const terms: Term[] = [
  {
    slug: 'jeonse-ratio',
    title: '전세가율',
    summary:
      '집값에서 전세 보증금이 차지하는 비율입니다. 이 비율이 높을수록 집값이 조금만 떨어져도 보증금을 돌려받기 어려워집니다.',
    alsoAsked: ['전세가율이란', '전세가율 계산법', '전세가율 높으면', '깡통전세'],
    related: ['gap', 'ltv'],
  },
  {
    slug: 'gap',
    title: '갭',
    summary:
      '집을 사는 값에서 세입자의 전세 보증금을 뺀 금액입니다. 그 집을 사려고 내가 실제로 넣어야 하는 돈입니다.',
    alsoAsked: ['갭이란', '갭투자 뜻', '갭 계산', '전세 낀 매매'],
    related: ['jeonse-ratio', 'ltv'],
  },
  {
    slug: 'ltv',
    title: 'LTV — 집값 대비 빌릴 수 있는 비율',
    summary:
      '집값에서 빌릴 수 있는 돈이 차지하는 비율입니다. 이 비율이 정해지면 내가 준비해야 할 돈도 함께 정해집니다.',
    alsoAsked: ['LTV란', 'LTV 뜻', 'LTV 70%', '주택담보대출 한도'],
    related: ['dsr', 'gap'],
  },
  {
    slug: 'dsr',
    title: 'DSR — 버는 돈에서 빚 갚는 데 쓰는 비율',
    summary:
      '한 해에 버는 돈에서 빚을 갚는 데 들어가는 돈이 차지하는 비율입니다. 빌릴 수 있는 비율을 채우지 못하게 막는 두 번째 문입니다.',
    alsoAsked: ['DSR이란', 'DSR 40%', 'DSR 계산', 'DSR 뜻'],
    related: ['ltv'],
  },
  {
    slug: 'area',
    title: '전용면적과 공급면적',
    summary:
      '광고에 적힌 평수는 집 안 넓이가 아닙니다. 계단과 복도까지 더한 넓이입니다. 집을 비교할 때 봐야 하는 것은 전용면적입니다.',
    alsoAsked: ['전용면적이란', '84제곱미터 몇평', '공급면적 차이', '전용률'],
    related: ['gap'],
  },
]

export const termMap = new Map(terms.map((t) => [t.slug, t]))

export function relatedOf(slug: string): Term[] {
  const t = termMap.get(slug)
  if (!t) return []
  return t.related.map((s) => termMap.get(s)).filter((x): x is Term => Boolean(x))
}
