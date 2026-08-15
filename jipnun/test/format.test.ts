import test from 'node:test'
import assert from 'node:assert/strict'
import { won, wonShort, percent, monthlyPayment } from '../src/lib/format.ts'

test('억과 만으로 끊어 적는다', () => {
  assert.equal(won(350_000_000), '3억 5,000만원')
  assert.equal(won(100_000_000), '1억원')
  assert.equal(won(85_000_000), '8,500만원')
  assert.equal(won(1_200_000_000), '12억원')
  assert.equal(won(0), '0원')
})

test('만원이 안 되는 돈은 그대로 적는다', () => {
  assert.equal(won(5_000), '5,000원')
})

test('억 단위가 딱 떨어지면 만을 붙이지 않는다', () => {
  assert.equal(won(400_000_000), '4억원')
})

test('짧은 표기는 소수 한 자리까지만 쓴다', () => {
  assert.equal(wonShort(350_000_000), '3.5억')
  assert.equal(wonShort(400_000_000), '4억')
  assert.equal(wonShort(1_200_000_000), '12억')
  assert.equal(wonShort(85_000_000), '8,500만')
})

test('비율은 뒤의 0을 지운다', () => {
  assert.equal(percent(68.0), '68%')
  assert.equal(percent(68.42), '68.4%')
})

test('원리금 균등 상환액', () => {
  // 2억 5천, 연 4%, 30년. 널리 알려진 값과 맞는지만 본다.
  const m = monthlyPayment(250_000_000, 0.04, 30)
  assert.ok(m > 1_190_000 && m < 1_200_000, `계산값이 벗어났다: ${m}`)
})

test('이자가 0이면 원금을 기간으로 나눈다', () => {
  assert.equal(monthlyPayment(120_000_000, 0, 10), 1_000_000)
})

test('빌린 돈이 없으면 갚을 돈도 없다', () => {
  assert.equal(monthlyPayment(0, 0.04, 30), 0)
})
