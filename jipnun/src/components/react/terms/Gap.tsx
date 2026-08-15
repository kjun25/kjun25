import { useState } from 'react'
import { Panel, Slider, Result, CompareBar, Legend, Says } from '../ui'
import { won } from '~/lib/format'

const EOK = 100_000_000

export default function Gap() {
  const [price, setPrice] = useState(5 * EOK)
  const [jeonse, setJeonse] = useState(3.5 * EOK)

  const capped = Math.min(jeonse, price)
  const gap = price - capped

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
        label="지금 살고 있는 세입자의 전세 보증금"
        value={capped}
        min={2000 * 10_000}
        max={15 * EOK}
        step={500 * 10_000}
        onChange={(v) => setJeonse(v)}
      />

      <CompareBar
        total={price}
        parts={[
          { label: '내가 넣는 돈', value: gap, tone: 'a' },
          { label: '세입자 보증금이 채우는 부분', value: capped, tone: 'b' },
        ]}
      />
      <Legend
        items={[
          { label: '내가 넣는 돈', value: won(gap), tone: 'a' },
          { label: '세입자 보증금', value: won(capped), tone: 'b' },
        ]}
      />

      <Result
        label="갭 — 집을 사려고 내가 넣어야 하는 돈"
        value={won(gap)}
        sub={`${won(price)} − ${won(capped)}`}
      />

      <Says>
        세입자가 있는 집을 사면 그 보증금만큼은 내 돈이 안 들어갑니다. 대신 세입자가
        나갈 때 <strong>{won(capped)}</strong>을 돌려줘야 합니다. 이 돈은 없어진 게
        아니라 나중에 낼 돈입니다.
      </Says>

      <p className="slider-hint" style={{ marginTop: '0.9rem' }}>
        여기에는 취득세, 중개 보수, 이사비가 들어 있지 않습니다. 실제로는 이보다 더
        듭니다.
      </p>
    </Panel>
  )
}
