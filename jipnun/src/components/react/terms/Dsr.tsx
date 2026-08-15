import { useState } from 'react'
import { Panel, Slider, Result, Says } from '../ui'
import { won, percent, monthlyPayment } from '~/lib/format'

const EOK = 100_000_000
const MAN = 10_000

export default function Dsr() {
  const [income, setIncome] = useState(4500 * MAN)
  const [loan, setLoan] = useState(2.5 * EOK)
  const [rate, setRate] = useState(4)
  const [years, setYears] = useState(30)

  const monthly = monthlyPayment(loan, rate / 100, years)
  const yearly = monthly * 12
  const dsr = income > 0 ? (yearly / income) * 100 : 0

  const tone = dsr > 40 ? 'danger' : dsr > 30 ? 'warn' : 'ok'

  return (
    <Panel>
      <Slider
        label="한 해에 버는 돈 (세전)"
        value={income}
        min={2000 * MAN}
        max={2 * EOK}
        step={100 * MAN}
        onChange={(v) => setIncome(v)}
      />
      <Slider
        label="빌리려는 돈"
        value={loan}
        min={2000 * MAN}
        max={10 * EOK}
        step={500 * MAN}
        onChange={(v) => setLoan(v)}
      />
      <Slider
        label="이자율 (한 해 기준)"
        value={rate}
        min={2}
        max={8}
        step={0.1}
        onChange={(v) => setRate(v)}
        format={(v) => percent(v)}
      />
      <Slider
        label="갚는 기간"
        value={years}
        min={10}
        max={40}
        step={5}
        onChange={(v) => setYears(v)}
        format={(v) => `${v}년`}
      />

      <Result
        label="다달이 갚는 돈"
        value={won(monthly)}
        sub={`한 해에 ${won(yearly)}`}
      />

      <Result
        label="한 해 버는 돈에서 갚는 데 쓰는 비율 (DSR)"
        value={percent(dsr)}
        tone={tone}
        sub={dsr > 40 ? '40%를 넘었습니다' : '40%가 흔히 쓰이는 기준선입니다'}
      />

      <Says>
        한 해에 {won(income)}을 벌고 {won(yearly)}을 갚는다면, 버는 돈의{' '}
        <strong>{percent(dsr)}</strong>가 빚 갚는 데 들어갑니다. 갚는 기간을 늘리면 이
        비율은 내려가지만 <strong>내는 이자의 총액은 늘어납니다</strong>.
      </Says>

      <p className="slider-hint" style={{ marginTop: '0.9rem' }}>
        여기서는 빚이 하나일 때를 계산했습니다. 실제로는 학자금, 신용대출, 할부까지
        모두 합쳐서 봅니다. 은행이 실제로 심사하는 결과와는 다릅니다.
      </p>
    </Panel>
  )
}
