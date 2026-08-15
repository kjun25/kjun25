/**
 * 돈을 사람이 읽는 방식으로 적는다.
 *
 * 부동산에서 처음 막히는 곳이 숫자다. 350000000 을 보고 3억 5천만 원임을
 * 바로 읽어내는 사람은 이미 초보자가 아니다. 화면에는 언제나 "3억 5,000만원"으로 적는다.
 */

const EOK = 100_000_000
const MAN = 10_000

/** 원 단위 정수를 "3억 5,000만원" 형태로 적는다. */
export function won(amount: number): string {
  if (!Number.isFinite(amount)) return '-'

  const sign = amount < 0 ? '-' : ''
  const n = Math.round(Math.abs(amount))

  if (n === 0) return '0원'
  if (n < MAN) return `${sign}${n.toLocaleString('ko-KR')}원`

  const eok = Math.floor(n / EOK)
  const man = Math.floor((n % EOK) / MAN)

  const parts: string[] = []
  if (eok > 0) parts.push(`${eok.toLocaleString('ko-KR')}억`)
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`)

  return `${sign}${parts.join(' ')}원`
}

/** 만원 단위 정수를 받는 자리용. 실거래가 자료가 만원 단위로 온다. */
export function wonFromMan(manAmount: number): string {
  return won(manAmount * MAN)
}

/** 슬라이더 옆에 짧게 붙이는 표기. "3.5억" */
export function wonShort(amount: number): string {
  if (!Number.isFinite(amount)) return '-'
  const sign = amount < 0 ? '-' : ''
  const n = Math.abs(amount)

  if (n === 0) return '0'
  if (n < MAN) return `${sign}${n.toLocaleString('ko-KR')}원`
  if (n < EOK) return `${sign}${Math.round(n / MAN).toLocaleString('ko-KR')}만`

  const eok = n / EOK
  const digits = eok < 10 ? 1 : 0
  return `${sign}${trimZero(eok.toFixed(digits))}억`
}

function trimZero(s: string): string {
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}

/** 비율. 68.4 -> "68.4%" */
export function percent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '-'
  return `${trimZero(value.toFixed(digits))}%`
}

/**
 * 원리금 균등 상환의 다달이 갚는 돈.
 * 이자율은 연 이자율을 소수로 넣는다. 0.04 는 연 4%.
 */
export function monthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0
  const n = Math.round(years * 12)
  const r = annualRate / 12
  if (r === 0) return principal / n
  const factor = Math.pow(1 + r, n)
  return (principal * r * factor) / (factor - 1)
}

/** 날짜를 "2026년 8월 15일"로 적는다. */
export function korDate(input: Date | string): string {
  const d = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return '-'
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}
