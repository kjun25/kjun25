import { useState } from 'react'
import { Panel, Slider, Result, CompareBar, Legend, Says } from '../ui'
import { won, percent } from '~/lib/format'

const EOK = 100_000_000

export default function Ltv() {
  const [price, setPrice] = useState(4 * EOK)
  const [ltv, setLtv] = useState(70)

  const loan = price * (ltv / 100)
  const mine = price - loan

  return (
    <Panel>
      <Slider
        label="집값"
        value={price}
        min={EOK}
        max={15 * EOK}
        step={1000 * 10_000}
        onChange={(v) => setPrice(v)}
      />
      <Slider
        label="빌릴 수 있는 비율"
        value={ltv}
        min={0}
        max={80}
        step={5}
        onChange={(v) => setLtv(v)}
        format={(v) => percent(v, 0)}
        hint="이 비율은 지역과 집값, 사는 사람의 조건에 따라 다르게 정해집니다."
      />

      <CompareBar
        total={price}
        parts={[
          { label: '빌리는 돈', value: loan, tone: 'a' },
          { label: '내가 준비할 돈', value: mine, tone: 'b' },
        ]}
      />
      <Legend
        items={[
          { label: '빌리는 돈', value: won(loan), tone: 'a' },
          { label: '내가 준비할 돈', value: won(mine), tone: 'b' },
        ]}
      />

      <Result label="내가 준비해야 하는 돈" value={won(mine)} />

      <Says>
        집값의 <strong>{percent(ltv, 0)}</strong>까지 빌린다면{' '}
        <strong>{won(mine)}</strong>은 내가 가지고 있어야 합니다. 빌릴 수 있는 비율이
        10%포인트 낮아지면 준비할 돈이 <strong>{won(price * 0.1)}</strong> 늘어납니다.
      </Says>

      <p className="slider-hint" style={{ marginTop: '0.9rem' }}>
        빌릴 수 있는 비율이 정해져도, 갚을 능력을 보는 기준(DSR)에 걸리면 실제로
        나오는 돈은 더 적을 수 있습니다.
      </p>
    </Panel>
  )
}
