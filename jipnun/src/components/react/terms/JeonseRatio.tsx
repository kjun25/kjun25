import { useState } from 'react'
import { Panel, Slider, Result, CompareBar, Legend, Says } from '../ui'
import { won, percent } from '~/lib/format'

const EOK = 100_000_000

export default function JeonseRatio() {
  const [price, setPrice] = useState(4 * EOK)
  const [jeonse, setJeonse] = useState(2.8 * EOK)

  const capped = Math.min(jeonse, price)
  const ratio = (capped / price) * 100
  const dropToEqual = 100 - ratio

  const tone = ratio >= 80 ? 'danger' : ratio >= 70 ? 'warn' : 'ok'

  return (
    <Panel>
      <Slider
        label="집을 사는 값 (매매가)"
        value={price}
        min={EOK}
        max={15 * EOK}
        step={1000 * 10_000}
        onChange={(v) => setPrice(v)}
      />
      <Slider
        label="전세 보증금"
        value={capped}
        min={2000 * 10_000}
        max={15 * EOK}
        step={500 * 10_000}
        onChange={(v) => setJeonse(v)}
        hint="매매가보다 높게는 둘 수 없습니다."
      />

      <CompareBar
        total={price}
        parts={[
          { label: '전세 보증금', value: capped, tone: 'a' },
          { label: '나머지', value: Math.max(0, price - capped), tone: 'b' },
        ]}
      />
      <Legend
        items={[
          { label: '전세 보증금', value: won(capped), tone: 'a' },
          { label: '나머지', value: won(Math.max(0, price - capped)), tone: 'b' },
        ]}
      />

      <Result
        label="전세가율"
        value={percent(ratio)}
        tone={tone}
        sub={`${won(capped)} ÷ ${won(price)}`}
      />

      <Says>
        집값이 <strong>{percent(dropToEqual)}</strong> 떨어지면 집값과 전세 보증금이
        같아집니다. 그보다 더 떨어지면 집을 팔아도 보증금을 다 돌려주지 못합니다.
      </Says>
    </Panel>
  )
}
