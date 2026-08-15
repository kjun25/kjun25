import type { Keyword, KeywordGroup, KeywordId, Persona } from './types.ts'

/**
 * 고를 수 있는 조건들.
 *
 * 화면에 나오는 말은 처음 보는 사람이 아는 말이어야 한다.
 * "역세권"이 아니라 "지하철역이 걸어갈 거리에".
 */
export const keywords: Keyword[] = [
  {
    id: 'subway',
    label: '지하철역이 가까웠으면',
    group: '오가는 길',
    help: '걸어서 10분 안이면 가깝다고 봅니다.',
  },
  {
    id: 'bus',
    label: '버스 정류장이 가까웠으면',
    group: '오가는 길',
    help: '지하철이 안 다니는 동네라면 이쪽을 봅니다.',
  },
  {
    id: 'commute',
    label: '정해 둔 곳까지 빨리 갔으면',
    group: '오가는 길',
    help: '아래에서 목적지를 고르면 대중교통으로 걸리는 시간을 봅니다.',
  },
  {
    id: 'cafe',
    label: '커피숍이 걸어갈 거리에',
    group: '가까이 있었으면',
    help: '동네에 사람이 다니는지를 보여주는 신호이기도 합니다.',
  },
  {
    id: 'convenience',
    label: '편의점이 가까웠으면',
    group: '가까이 있었으면',
    help: '밤에 나갈 수 있는 곳이 있는지를 봅니다.',
  },
  {
    id: 'mart',
    label: '큰 마트가 가까웠으면',
    group: '가까이 있었으면',
    help: '한 번에 장을 보는 사람에게 중요합니다.',
  },
  {
    id: 'hospital',
    label: '큰 병원이 가까웠으면',
    group: '가까이 있었으면',
    help: '아이가 있거나 나이 드신 분과 함께 살면 중요합니다.',
  },
  {
    id: 'park',
    label: '공원이 가까웠으면',
    group: '동네 분위기',
    help: '걸어 다닐 곳이 있는지를 봅니다.',
  },
  {
    id: 'quiet',
    label: '조용한 동네였으면',
    group: '동네 분위기',
    help: '번화가와 가까우면 편하지만 밤에 시끄러울 수 있습니다.',
  },
  {
    id: 'elementary',
    label: '초등학교가 걸어갈 거리에',
    group: '동네 분위기',
    help: '큰길을 건너지 않고 갈 수 있는지가 중요합니다.',
  },
  {
    id: 'academy',
    label: '학원이 모여 있는 곳이 가까웠으면',
    group: '동네 분위기',
    help: '아이가 학교에 들어간 뒤부터 중요해집니다.',
  },
  {
    id: 'newbuild',
    label: '지은 지 오래되지 않았으면',
    group: '집 자체',
    help: '오래된 집은 값이 싼 대신 고칠 곳이 생깁니다.',
  },
  {
    id: 'parking',
    label: '주차가 넉넉했으면',
    group: '집 자체',
    help: '오래된 아파트는 한 세대에 한 대가 안 되는 곳도 있습니다.',
  },
]

export const keywordMap = new Map(keywords.map((k) => [k.id, k]))

export const groupOrder: KeywordGroup[] = [
  '오가는 길',
  '가까이 있었으면',
  '동네 분위기',
  '집 자체',
]

export function keywordsByGroup(group: KeywordGroup): Keyword[] {
  return keywords.filter((k) => k.group === group)
}

/**
 * 어떤 사람인지 고르면 자주 쓰는 조건이 미리 켜진다.
 * 켜진 것을 끄거나 다른 것을 더할 수 있다. 시작점일 뿐이다.
 */
export const personas: Persona[] = [
  {
    id: 'first-job',
    label: '이제 막 일을 시작했어요',
    blurb: '혼자 살고, 회사까지 오가는 길이 가장 중요한 때입니다.',
    keywords: ['subway', 'bus', 'commute', 'cafe', 'convenience'],
  },
  {
    id: 'newlywed',
    label: '결혼을 앞뒀거나 막 했어요',
    blurb: '둘이 살 첫 집. 오가는 길과 살기 편한 정도를 같이 봅니다.',
    keywords: ['subway', 'commute', 'mart', 'park', 'newbuild', 'parking'],
  },
  {
    id: 'with-kids',
    label: '아이와 함께 살아요',
    blurb: '학교까지 가는 길과 조용한 정도가 앞으로 나옵니다.',
    keywords: ['elementary', 'park', 'quiet', 'mart', 'hospital', 'academy'],
  },
  {
    id: 'alone',
    label: '혼자 오래 살 집을 찾아요',
    blurb: '병원과 장 보는 곳, 그리고 조용한 정도를 봅니다.',
    keywords: ['hospital', 'mart', 'bus', 'quiet', 'park'],
  },
]

export const personaMap = new Map(personas.map((p) => [p.id, p]))

export function isKeywordId(v: string): v is KeywordId {
  return keywordMap.has(v as KeywordId)
}
