import { useState } from 'react'
import { Panel, Slider, Result, CompareBar, Legend, Says } from '../ui'

const PYEONG = 3.305785

function pyeong(m2: number): string {
  return `${(m2 / PYEONG).toFixed(1)}평`
}

function m2(v: number): string {
  return `${v.toFixed(1)}m²`
}

export default function Area() {
  const [exclusive, setExclusive] = useState(84)
  const [rate, setRate] = useState(75)

  const supply = exclusive / (rate / 100)
  const shared = supply - exclusive

  return (
    <Panel>
      <Slider
        label="전용면적 — 우리 집 현관문 안쪽"
        value={exclusive}
        min={30}
        max={150}
        step={1}
        onChange={(v) => setExclusive(v)}
        format={(v) => `${v}m²`}
      />
      <Slider
        label="전용률 — 공급면적 중에 전용면적이 차지하는 비율"
        value={rate}
        min={65}
        max={85}
        step={1}
        onChange={(v) => setRate(v)}
        format={(v) => `${v}%`}
        hint="아파트마다 다릅니다. 보통 70~80% 사이입니다."
      />

      <CompareBar
        total={supply}
        parts={[
          { label: '전용면적', value: exclusive, tone: 'a' },
          { label: '같이 쓰는 면적', value: shared, tone: 'b' },
        ]}
      />
      <Legend
        items={[
          { label: '전용면적 (집 안)', value: `${m2(exclusive)} · ${pyeong(exclusive)}`, tone: 'a' },
          { label: '계단·복도 등', value: `${m2(shared)} · ${pyeong(shared)}`, tone: 'b' },
        ]}
      />

      <Result
        label="전용면적을 평으로 바꾸면"
        value={pyeong(exclusive)}
        sub={`${m2(exclusive)} ÷ 3.3058`}
      />

      <Result
        label="공급면적 — 광고에 적히는 넓이"
        value={`${pyeong(supply)}`}
        sub={m2(supply)}
      />

      <Says>
        전용 <strong>{m2(exclusive)}</strong>인 집을 사람들은 보통{' '}
        <strong>{Math.round(supply / PYEONG)}평</strong>이라고 부릅니다. 그 숫자는 집
        안 넓이가 아니라 계단과 복도까지 더한 넓이입니다. 실제로 사는 공간은{' '}
        <strong>{pyeong(exclusive)}</strong>입니다.
      </Says>

      <p className="slider-hint" style={{ marginTop: '0.9rem' }}>
        같은 &quot;34평&quot;이라도 전용률이 다르면 집 안 넓이가 다릅니다. 집을 비교할
        때는 평이 아니라 전용면적을 보면 됩니다.
      </p>
    </Panel>
  )
}
