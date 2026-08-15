/** 동네 찾기에서 쓰는 값들. */

export type DealType = 'jeonse' | 'monthly' | 'sale'

export const dealLabels: Record<DealType, string> = {
  jeonse: '전세',
  monthly: '월세',
  sale: '매매',
}

export type KeywordGroup = '오가는 길' | '가까이 있었으면' | '동네 분위기' | '집 자체'

export type KeywordId =
  | 'subway'
  | 'bus'
  | 'commute'
  | 'cafe'
  | 'convenience'
  | 'mart'
  | 'hospital'
  | 'park'
  | 'quiet'
  | 'elementary'
  | 'academy'
  | 'newbuild'
  | 'parking'

export type Keyword = {
  id: KeywordId
  label: string
  group: KeywordGroup
  /** 왜 이걸 고르는지 한 줄. 처음 보는 사람에게는 이 문장이 필요하다. */
  help: string
}

export type PersonaId = 'first-job' | 'newlywed' | 'with-kids' | 'alone'

export type Persona = {
  id: PersonaId
  label: string
  blurb: string
  /** 고르면 자동으로 켜지는 것들. 켜고 끄고 더할 수 있다. */
  keywords: KeywordId[]
}

/**
 * 한 동네에 대해 우리가 아는 사실.
 *
 * 값이 없으면(undefined) "모른다"는 뜻이다. "안 맞는다"와 다르게 다뤄야 한다.
 * 초보자에게 모르는 것을 아는 척하면 안 된다.
 */
export type Facts = {
  /** 가장 가까운 지하철역까지 걸어서 몇 분 */
  subwayMin?: number
  /** 가장 가까운 버스 정류장까지 걸어서 몇 분 */
  busMin?: number
  /** 목적지별 대중교통 소요 시간(분) */
  commuteMin?: Record<string, number>
  /** 걸어갈 거리 안에 있는 개수 */
  cafeCount?: number
  convenienceCount?: number
  /** 큰 마트까지 몇 분 (차 또는 대중교통) */
  martMin?: number
  /** 종합병원까지 몇 분 */
  hospitalMin?: number
  /** 공원까지 걸어서 몇 분 */
  parkMin?: number
  /** 1(아주 번화) ~ 5(아주 조용) */
  quietLevel?: number
  /** 초등학교까지 걸어서 몇 분 */
  elementaryMin?: number
  /** 학원가까지 몇 분 */
  academyMin?: number
  /** 아파트가 많이 지어진 시기의 가운데 값 */
  builtYearMedian?: number
  /** 한 세대당 주차 면수 */
  parkingPerHousehold?: number
}

/** 값의 출처. 화면에 무엇이 확인된 사실인지 밝히기 위한 것이다. */
export type Provenance = 'confirmed' | 'placeholder'

export type Area = {
  id: string
  sido: string
  sigungu: string
  dong: string
  /** 대표 가격대(원). 실거래가를 붙이면 여기가 실제 값으로 바뀐다. */
  price: Partial<Record<DealType, { low: number; high: number }>>
  facts: Facts
  /** 각 값이 확인된 것인지 아직 채워 넣은 값인지 */
  provenance: Partial<Record<keyof Facts | 'price', Provenance>>
  note?: string
}

export type Query = {
  sido: string
  sigungu: string | null
  deal: DealType
  min: number
  max: number
  keywords: KeywordId[]
  commuteTo: string | null
}

export type KeywordVerdict = {
  id: KeywordId
  label: string
  /** 0~1. 모르면 null */
  score: number | null
  /** 화면에 그대로 나가는 짧은 설명 */
  detail: string
}

export type Hit = {
  area: Area
  /** 0~100 */
  score: number
  priceFits: boolean
  verdicts: KeywordVerdict[]
  known: number
  unknown: number
}
