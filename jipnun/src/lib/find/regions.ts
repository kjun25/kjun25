import type { Area, Provenance } from './types.ts'

/**
 * 동네 자료.
 *
 * ────────────────────────────────────────────────────────────────
 *  지금 이 파일의 숫자는 전부 임시로 채워 넣은 값이다. 실제 조사값이 아니다.
 *  화면에도 그렇게 밝히고 있다. 이 파일이 하는 일은 두 가지다.
 *   1) 계산과 화면이 끝까지 도는지 확인한다
 *   2) 실제 자료가 들어올 자리의 모양을 정한다
 *
 *  실제 값으로 바꾸는 방법은 아래와 같다. 전부 무료로 공개돼 있다.
 *   - 값       : 국토교통부 실거래가 (공공데이터포털)
 *   - 지하철   : 국가철도공단 역사 위치
 *   - 버스     : 대전광역시 버스 정류장 정보
 *   - 커피숍·편의점 : 소상공인시장진흥공단 상가업소 정보
 *   - 학교     : 학교알리미 / 교육부 학교 기본정보
 *   - 공원     : 전국 도시공원 표준데이터
 *  값을 채우면 provenance를 'confirmed'로 바꾼다. 화면의 안내 문구도 같이 사라진다.
 * ────────────────────────────────────────────────────────────────
 */

const P: Provenance = 'placeholder'

/** 지금 자료에 확인된 값이 하나라도 있는지 */
export const dataIsProvisional = true

export const commuteTargets: Record<string, string[]> = {
  대전광역시: ['대전시청', '정부대전청사', '대덕연구단지', '대전역'],
}

const 만 = 10_000
const 억 = 100_000_000

function allPlaceholder(): Area['provenance'] {
  return {
    price: P,
    subwayMin: P,
    busMin: P,
    commuteMin: P,
    cafeCount: P,
    convenienceCount: P,
    martMin: P,
    hospitalMin: P,
    parkMin: P,
    quietLevel: P,
    elementaryMin: P,
    academyMin: P,
    builtYearMedian: P,
    parkingPerHousehold: P,
  }
}

type Seed = {
  sigungu: string
  dong: string
  jeonse: [number, number]
  sale: [number, number]
  subwayMin?: number
  busMin: number
  commute: [number, number, number, number]
  cafe: number
  cvs: number
  mart: number
  hospital: number
  park: number
  quiet: number
  elem: number
  academy: number
  built: number
  parking: number
  note?: string
}

const seeds: Seed[] = [
  {
    sigungu: '유성구', dong: '지족동',
    jeonse: [2.2 * 억, 3.6 * 억], sale: [4 * 억, 6.5 * 억],
    subwayMin: 6, busMin: 3, commute: [32, 28, 22, 40],
    cafe: 14, cvs: 6, mart: 12, hospital: 18, park: 7, quiet: 4,
    elem: 7, academy: 10, built: 2004, parking: 1.3,
  },
  {
    sigungu: '유성구', dong: '노은동',
    jeonse: [2 * 억, 3.2 * 억], sale: [3.6 * 억, 5.8 * 억],
    subwayMin: 8, busMin: 4, commute: [34, 30, 24, 42],
    cafe: 11, cvs: 5, mart: 14, hospital: 20, park: 6, quiet: 4,
    elem: 6, academy: 12, built: 2001, parking: 1.2,
  },
  {
    sigungu: '유성구', dong: '봉명동',
    jeonse: [1.4 * 억, 2.4 * 억], sale: [2.6 * 억, 4.2 * 억],
    subwayMin: 5, busMin: 2, commute: [28, 24, 18, 34],
    cafe: 22, cvs: 9, mart: 10, hospital: 14, park: 12, quiet: 2,
    elem: 12, academy: 8, built: 1999, parking: 0.9,
  },
  {
    sigungu: '유성구', dong: '도룡동',
    jeonse: [3 * 억, 4.8 * 억], sale: [6 * 억, 11 * 억],
    subwayMin: 18, busMin: 5, commute: [26, 22, 8, 30],
    cafe: 8, cvs: 3, mart: 16, hospital: 16, park: 4, quiet: 5,
    elem: 8, academy: 18, built: 2010, parking: 1.5,
  },
  {
    sigungu: '유성구', dong: '관평동',
    jeonse: [1.9 * 억, 3 * 억], sale: [3.4 * 억, 5.2 * 억],
    subwayMin: 22, busMin: 4, commute: [40, 36, 10, 46],
    cafe: 9, cvs: 5, mart: 13, hospital: 22, park: 8, quiet: 4,
    elem: 6, academy: 14, built: 2007, parking: 1.3,
  },
  {
    sigungu: '유성구', dong: '상대동',
    jeonse: [2.6 * 억, 4 * 억], sale: [5 * 억, 8 * 억],
    subwayMin: 12, busMin: 3, commute: [30, 26, 20, 36],
    cafe: 16, cvs: 7, mart: 8, hospital: 16, park: 5, quiet: 3,
    elem: 7, academy: 9, built: 2015, parking: 1.4,
  },
  {
    sigungu: '서구', dong: '둔산동',
    jeonse: [2.8 * 억, 4.4 * 억], sale: [5.5 * 억, 9.5 * 억],
    subwayMin: 5, busMin: 2, commute: [8, 6, 26, 22],
    cafe: 28, cvs: 11, mart: 7, hospital: 9, park: 5, quiet: 2,
    elem: 6, academy: 5, built: 1994, parking: 1.0,
  },
  {
    sigungu: '서구', dong: '탄방동',
    jeonse: [2.2 * 억, 3.4 * 억], sale: [4.2 * 억, 6.8 * 억],
    subwayMin: 4, busMin: 3, commute: [10, 9, 28, 20],
    cafe: 18, cvs: 8, mart: 9, hospital: 11, park: 8, quiet: 3,
    elem: 8, academy: 7, built: 1996, parking: 0.9,
  },
  {
    sigungu: '서구', dong: '월평동',
    jeonse: [1.8 * 억, 2.9 * 억], sale: [3.4 * 억, 5.4 * 억],
    subwayMin: 6, busMin: 3, commute: [14, 12, 22, 26],
    cafe: 13, cvs: 7, mart: 11, hospital: 15, park: 6, quiet: 3,
    elem: 7, academy: 10, built: 1997, parking: 0.9,
  },
  {
    sigungu: '서구', dong: '관저동',
    jeonse: [1.5 * 억, 2.4 * 억], sale: [2.8 * 억, 4.4 * 억],
    busMin: 4, commute: [26, 28, 42, 34],
    cafe: 7, cvs: 4, mart: 14, hospital: 24, park: 9, quiet: 4,
    elem: 6, academy: 16, built: 2002, parking: 1.1,
  },
  {
    sigungu: '서구', dong: '도안동',
    jeonse: [2.6 * 억, 4.2 * 억], sale: [5 * 억, 8.5 * 억],
    subwayMin: 16, busMin: 3, commute: [20, 18, 26, 32],
    cafe: 12, cvs: 6, mart: 9, hospital: 18, park: 4, quiet: 4,
    elem: 5, academy: 8, built: 2012, parking: 1.4,
  },
  {
    sigungu: '중구', dong: '오류동',
    jeonse: [1.3 * 억, 2.2 * 억], sale: [2.4 * 억, 3.8 * 억],
    subwayMin: 7, busMin: 2, commute: [16, 18, 32, 12],
    cafe: 15, cvs: 8, mart: 12, hospital: 12, park: 11, quiet: 2,
    elem: 10, academy: 12, built: 1993, parking: 0.7,
  },
  {
    sigungu: '중구', dong: '태평동',
    jeonse: [1.2 * 억, 2 * 억], sale: [2.2 * 억, 3.6 * 억],
    subwayMin: 9, busMin: 3, commute: [18, 20, 34, 14],
    cafe: 10, cvs: 6, mart: 13, hospital: 14, park: 8, quiet: 3,
    elem: 8, academy: 14, built: 1995, parking: 0.8,
  },
  {
    sigungu: '중구', dong: '산성동',
    jeonse: [1.1 * 억, 1.9 * 억], sale: [2 * 억, 3.4 * 억],
    busMin: 4, commute: [22, 24, 38, 18],
    cafe: 6, cvs: 4, mart: 16, hospital: 16, park: 5, quiet: 4,
    elem: 9, academy: 18, built: 1998, parking: 0.8,
  },
  {
    sigungu: '동구', dong: '가오동',
    jeonse: [1.4 * 억, 2.3 * 억], sale: [2.6 * 억, 4 * 억],
    busMin: 4, commute: [24, 26, 40, 14],
    cafe: 8, cvs: 5, mart: 14, hospital: 18, park: 7, quiet: 4,
    elem: 6, academy: 16, built: 2003, parking: 1.1,
  },
  {
    sigungu: '동구', dong: '판암동',
    jeonse: [1 * 억, 1.7 * 억], sale: [1.8 * 억, 3 * 억],
    subwayMin: 5, busMin: 3, commute: [22, 24, 40, 10],
    cafe: 7, cvs: 5, mart: 15, hospital: 17, park: 6, quiet: 3,
    elem: 8, academy: 20, built: 1994, parking: 0.7,
  },
  {
    sigungu: '대덕구', dong: '송촌동',
    jeonse: [1.6 * 억, 2.6 * 억], sale: [3 * 억, 4.8 * 억],
    busMin: 3, commute: [26, 24, 16, 20],
    cafe: 10, cvs: 6, mart: 10, hospital: 14, park: 5, quiet: 4,
    elem: 6, academy: 12, built: 1997, parking: 1.0,
  },
  {
    sigungu: '대덕구', dong: '오정동',
    jeonse: [1.2 * 억, 2 * 억], sale: [2.2 * 억, 3.6 * 억],
    busMin: 3, commute: [24, 22, 12, 18],
    cafe: 12, cvs: 7, mart: 12, hospital: 15, park: 9, quiet: 3,
    elem: 9, academy: 16, built: 1996, parking: 0.8,
  },
]

export const areas: Area[] = seeds.map((s) => ({
  id: `대전-${s.sigungu}-${s.dong}`,
  sido: '대전광역시',
  sigungu: s.sigungu,
  dong: s.dong,
  price: {
    jeonse: { low: s.jeonse[0], high: s.jeonse[1] },
    sale: { low: s.sale[0], high: s.sale[1] },
    monthly: { low: 1000 * 만, high: 5000 * 만 },
  },
  facts: {
    subwayMin: s.subwayMin,
    busMin: s.busMin,
    commuteMin: {
      대전시청: s.commute[0],
      정부대전청사: s.commute[1],
      대덕연구단지: s.commute[2],
      대전역: s.commute[3],
    },
    cafeCount: s.cafe,
    convenienceCount: s.cvs,
    martMin: s.mart,
    hospitalMin: s.hospital,
    parkMin: s.park,
    quietLevel: s.quiet,
    elementaryMin: s.elem,
    academyMin: s.academy,
    builtYearMedian: s.built,
    parkingPerHousehold: s.parking,
  },
  provenance: allPlaceholder(),
  note: s.note,
}))

export const sidoList = ['대전광역시']

export function sigunguOf(sido: string): string[] {
  return [...new Set(areas.filter((a) => a.sido === sido).map((a) => a.sigungu))]
}
