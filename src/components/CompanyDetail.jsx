import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'
import { X, TrendingUp, AlertTriangle, CheckCircle, Users, Calendar } from 'lucide-react'
import { projectReturn, calcRiskScore, RISK_LABELS, fmtLKR, fmtPct, calcEPSGrowth } from '../utils/finance'
import { useStockChart } from '../hooks/useCseData'

const CHART_PERIODS = ['1W','1M','3M','6M','1Y','5Y']
const TABS = ['Overview','Financials','Dividends','Return Calculator','Related']

const tooltipStyle = {
  backgroundColor: '#152D52',
  border: '1px solid #1E3050',
  borderRadius: 8,
  color: '#E8EDF5',
  fontSize: 12,
}

export default function CompanyDetail({ company: c, liveDetail, onClose }) {
  const [tab, setTab]           = useState('Overview')
  const [chartPeriod, setChartPeriod] = useState('3M')
  const [investAmt, setInvestAmt]   = useState(100000)
  const [investYears, setInvestYears] = useState(5)
  const [reinvestDiv, setReinvestDiv] = useState(true)
  const { chartData, loading: chartLoading } = useStockChart(c.symbol, chartPeriod)

  const financials = c.financials || []
  const years      = financials.map(f => f.year)
  const lastFin    = financials.slice(-1)[0] || {}
  const prevFin    = financials.slice(-2, -1)[0] || {}

  const epsGrowthArr = financials.slice(1).map((f, i) => {
    const prev = financials[i]
    if (!prev?.eps || prev.eps === 0) return 0
    return +((((f.eps - prev.eps) / Math.abs(prev.eps)) * 100).toFixed(1))
  })
  const riskScore = calcRiskScore(c.de, c.icr, epsGrowthArr)
  const risk = RISK_LABELS[riskScore]

  const avg3yrEPSGrowth = epsGrowthArr.slice(-3).reduce((a, b) => a + b, 0) / 3
  const proj = projectReturn(investAmt, avg3yrEPSGrowth * 0.8, c.divYield || 0, investYears, reinvestDiv)

  const revenueData = financials.map(f => ({ year: f.year, revenue: f.revenue, netIncome: f.netIncome }))
  const epsData     = financials.map((f, i) => ({
    year: f.year, eps: f.eps,
    growth: i > 0 ? epsGrowthArr[i - 1] : 0,
  }))
  const divData     = financials.map(f => ({ year: f.year, dividend: f.dividend || 0 }))
  const debtData    = financials.map(f => ({
    year: f.year,
    debt: f.totalDebt, equity: f.equity,
    de: f.equity ? +(f.totalDebt / f.equity).toFixed(2) : 0,
  }))
  const projData    = proj.yearlyData.map(d => ({
    year: `Y${d.year}`, value: d.value, cumDiv: d.cumDiv,
  }))

  // Use live API data if available
  const livePrice    = liveDetail?.lastTradedPrice || c.price
  const liveChange   = liveDetail?.percentageChange
  const liveVolume   = liveDetail?.volume

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl h-full bg-cse-navy border-l border-cse-border overflow-y-auto animate-slide-up flex flex-col">

        {/* Panel header */}
        <div className="sticky top-0 z-10 bg-cse-navy border-b border-cse-border px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-cse-gold text-lg font-medium">{c.ticker}</span>
              <span
                className="text-xs px-2 py-0.5 rounded border font-medium"
                style={{ color: risk.color, borderColor: risk.color + '40', background: risk.color + '15' }}
              >
                {risk.label} risk
              </span>
            </div>
            <div className="font-display text-white text-xl mt-1">{c.name}</div>
            <div className="text-cse-muted text-sm mt-0.5">{c.sector} · {c.ownerGroup}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-white text-2xl">LKR {Number(livePrice).toFixed(2)}</div>
            {liveChange && (
              <div className={`font-mono text-sm ${liveChange >= 0 ? 'text-cse-up' : 'text-cse-down'}`}>
                {liveChange >= 0 ? '+' : ''}{liveChange}%
              </div>
            )}
            <button onClick={onClose} className="btn-ghost mt-2 text-xs flex items-center gap-1 ml-auto">
              <X size={12} /> Close
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 border-b border-cse-border">
          {TABS.map(t => (
            <button key={t} className={`tab-btn pb-3 rounded-none border-b-2 ${tab === t ? 'border-cse-gold text-cse-gold' : 'border-transparent'}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">

          {/* ── OVERVIEW ── */}
          {tab === 'Overview' && (
            <>
              <p className="text-cse-muted text-sm leading-relaxed">{c.description}</p>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'P/E Ratio',      value: c.pe,          note: c.pe < 10 ? 'Value' : 'Growth priced' },
                  { label: 'EPS (LKR)',       value: c.eps,         note: '' },
                  { label: 'Div Yield',       value: c.divYield ? c.divYield + '%' : 'None', note: c.payout ? `${c.payout}% payout` : '' },
                  { label: 'Debt / Equity',   value: c.de + '×',   note: c.de < 1 ? 'Conservative' : c.de < 2 ? 'Moderate' : 'High' },
                  { label: 'Interest Cover',  value: c.icr + '×',  note: c.icr > 5 ? 'Very safe' : 'Manageable' },
                  { label: 'Volume today',    value: liveVolume ? Number(liveVolume).toLocaleString() : '—', note: 'shares' },
                ].map(({ label, value, note }) => (
                  <div key={label} className="card p-3">
                    <div className="text-xs text-cse-muted mb-1">{label}</div>
                    <div className="font-mono text-white text-base">{value}</div>
                    {note && <div className="text-xs text-cse-muted/70 mt-0.5">{note}</div>}
                  </div>
                ))}
              </div>

              {/* Stock price chart */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Price chart</span>
                  <div className="flex gap-1">
                    {CHART_PERIODS.map(p => (
                      <button key={p} onClick={() => setChartPeriod(p)}
                        className={`text-xs px-2 py-1 rounded ${chartPeriod === p ? 'bg-cse-gold/20 text-cse-gold' : 'text-cse-muted hover:text-white'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {chartLoading ? (
                  <div className="h-32 shimmer rounded-lg" />
                ) : chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={130}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B9BB4' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#8B9BB4' }} tickLine={false} width={45} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="price" stroke="#C9A84C" fill="url(#priceGrad)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-32 flex items-center justify-center text-cse-muted text-sm">
                    Live chart loads when market is open
                  </div>
                )}
              </div>

              {/* Loan vs earnings summary */}
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  {c.de > 2 ? <AlertTriangle size={14} className="text-cse-down" /> : <CheckCircle size={14} className="text-cse-up" />}
                  <span className="text-sm font-medium text-white">Loan & earnings health</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-cse-muted text-xs mb-1">Total debt (latest)</div>
                    <div className="font-mono text-white">{fmtLKR(lastFin.totalDebt, 'B')}</div>
                  </div>
                  <div>
                    <div className="text-cse-muted text-xs mb-1">Total equity</div>
                    <div className="font-mono text-white">{fmtLKR(lastFin.equity, 'B')}</div>
                  </div>
                  <div>
                    <div className="text-cse-muted text-xs mb-1">Net income (latest)</div>
                    <div className="font-mono text-cse-up">{fmtLKR(lastFin.netIncome, 'B')}</div>
                  </div>
                  <div>
                    <div className="text-cse-muted text-xs mb-1">Revenue (latest)</div>
                    <div className="font-mono text-white">{fmtLKR(lastFin.revenue, 'B')}</div>
                  </div>
                </div>
                <div className={`mt-3 text-xs p-2 rounded ${c.de > 2 ? 'bg-cse-down/10 text-cse-down' : 'bg-cse-up/10 text-cse-up'}`}>
                  {c.de > 2
                    ? `⚠ High debt load (D/E ${c.de}×). Monitor quarterly — rising interest rates increase risk.`
                    : `✓ Healthy leverage at ${c.de}× D/E. Interest coverage ${c.icr}× provides good safety margin.`
                  }
                </div>
              </div>
            </>
          )}

          {/* ── FINANCIALS ── */}
          {tab === 'Financials' && (
            <>
              <div className="card p-4">
                <div className="text-sm font-medium text-white mb-3">Revenue & Net Income (LKR Bn)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3050" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#8B9BB4' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#8B9BB4' }} width={35} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => `LKR ${v}B`} />
                    <Bar dataKey="revenue" fill="#185FA5" radius={[3, 3, 0, 0]} name="Revenue" />
                    <Bar dataKey="netIncome" fill="#1DB88A" radius={[3, 3, 0, 0]} name="Net Income" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-4">
                <div className="text-sm font-medium text-white mb-3">EPS (LKR) & YoY Growth %</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={epsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3050" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#8B9BB4' }} />
                    <YAxis yAxisId="eps" tick={{ fontSize: 10, fill: '#8B9BB4' }} width={35} />
                    <YAxis yAxisId="growth" orientation="right" tick={{ fontSize: 10, fill: '#8B9BB4' }} width={35} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar yAxisId="eps" dataKey="eps" fill="#C9A84C" radius={[3, 3, 0, 0]} name="EPS" />
                    <Bar yAxisId="growth" dataKey="growth" fill="#0D7C6E" radius={[3, 3, 0, 0]} name="Growth %" />
                    <ReferenceLine yAxisId="growth" y={0} stroke="#E84545" strokeDasharray="4 2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-4">
                <div className="text-sm font-medium text-white mb-3">Debt vs Equity trend (LKR Bn)</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={debtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3050" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#8B9BB4' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#8B9BB4' }} width={35} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => `LKR ${v}B`} />
                    <Area type="monotone" dataKey="debt" stroke="#E84545" fill="#E84545" fillOpacity={0.15} strokeWidth={1.5} name="Total Debt" />
                    <Area type="monotone" dataKey="equity" stroke="#1DB88A" fill="#1DB88A" fillOpacity={0.15} strokeWidth={1.5} name="Total Equity" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 10-year table */}
              <div className="card overflow-hidden">
                <div className="text-sm font-medium text-white p-4 pb-2">10-year financial summary</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-cse-navy/60">
                      <tr>
                        {['Year','Revenue','Net Income','EPS','Dividend','D/E','Debt','Equity'].map(h => (
                          <th key={h} className="text-left py-2 px-3 text-cse-muted font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {financials.map((f, i) => {
                        const prevEPS = i > 0 ? financials[i-1].eps : null
                        const growth = prevEPS ? calcEPSGrowth(f.eps, prevEPS) : null
                        const de = f.equity ? +(f.totalDebt / f.equity).toFixed(2) : '—'
                        return (
                          <tr key={f.year} className="border-b border-cse-border last:border-0 hover:bg-white/[0.02]">
                            <td className="py-2 px-3 font-mono text-cse-gold">{f.year}</td>
                            <td className="py-2 px-3 font-mono text-white">{f.revenue}B</td>
                            <td className="py-2 px-3 font-mono text-cse-up">{f.netIncome}B</td>
                            <td className="py-2 px-3">
                              <span className="font-mono text-white">{f.eps}</span>
                              {growth !== null && (
                                <span className={`ml-1 ${growth >= 0 ? 'text-cse-up' : 'text-cse-down'}`}>
                                  ({fmtPct(growth)})
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono text-cse-gold">{f.dividend || '—'}</td>
                            <td className={`py-2 px-3 font-mono ${de > 2 ? 'text-cse-down' : de > 1 ? 'text-cse-warn' : 'text-cse-up'}`}>{de}×</td>
                            <td className="py-2 px-3 font-mono text-cse-muted">{f.totalDebt}B</td>
                            <td className="py-2 px-3 font-mono text-cse-muted">{f.equity}B</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── DIVIDENDS ── */}
          {tab === 'Dividends' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="card p-3">
                  <div className="text-xs text-cse-muted mb-1">Current yield</div>
                  <div className="font-mono text-cse-up text-xl">{c.divYield > 0 ? c.divYield + '%' : 'No div'}</div>
                </div>
                <div className="card p-3">
                  <div className="text-xs text-cse-muted mb-1">Payout ratio</div>
                  <div className={`font-mono text-xl ${c.payout > 80 ? 'text-cse-down' : 'text-white'}`}>{c.payout ? c.payout + '%' : '—'}</div>
                  <div className="text-xs text-cse-muted mt-0.5">{c.payout > 80 ? 'May be unsustainable' : 'Sustainable'}</div>
                </div>
                <div className="card p-3">
                  <div className="text-xs text-cse-muted mb-1">Total div paid (10yr)</div>
                  <div className="font-mono text-white text-xl">
                    LKR {financials.reduce((s, f) => s + (f.dividend || 0), 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-cse-muted mt-0.5">per share</div>
                </div>
              </div>

              <div className="card p-4">
                <div className="text-sm font-medium text-white mb-3">Annual dividend per share (LKR)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={divData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3050" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#8B9BB4' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#8B9BB4' }} width={35} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => `LKR ${v}`} />
                    <Bar dataKey="dividend" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Dividend (LKR)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-4 space-y-3 text-sm">
                <div className="font-medium text-white">How dividends affect your investment</div>
                <div className="text-cse-muted leading-relaxed">
                  If you invest <span className="text-white font-mono">LKR 100,000</span> at current yield of&nbsp;
                  <span className="text-cse-up font-mono">{c.divYield}%</span>, you receive approximately&nbsp;
                  <span className="text-cse-gold font-mono">LKR {((100000 * c.divYield) / 100).toFixed(0)}</span> per year as cash dividend income.
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-cse-navy rounded-lg p-3 border border-cse-border">
                    <div className="text-xs text-cse-muted mb-1">Take as cash</div>
                    <div className="font-mono text-white">LKR {((100000 * c.divYield) / 100).toFixed(0)}/yr</div>
                    <div className="text-xs text-cse-muted mt-1">Passive income stream</div>
                  </div>
                  <div className="bg-cse-navy rounded-lg p-3 border border-cse-gold/20">
                    <div className="text-xs text-cse-muted mb-1">Reinvest (DRIP)</div>
                    <div className="font-mono text-cse-gold">Compounding boost</div>
                    <div className="text-xs text-cse-muted mt-1">Buys more shares each year</div>
                  </div>
                </div>
                <div className={`text-xs p-2 rounded ${c.payout > 80 ? 'bg-cse-warn/10 text-cse-warn' : 'bg-cse-up/10 text-cse-up'}`}>
                  {c.payout > 80
                    ? `Payout ratio ${c.payout}% is high — dividend may be cut if earnings fall. Check latest quarterly report.`
                    : `Payout ratio ${c.payout}% leaves room to grow the dividend. Historically consistent payments.`
                  }
                </div>
              </div>
            </>
          )}

          {/* ── RETURN CALCULATOR ── */}
          {tab === 'Return Calculator' && (
            <>
              <div className="card p-4 space-y-4">
                <div className="text-sm font-medium text-white">Investment scenario</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-cse-muted block mb-1.5">Investment amount (LKR)</label>
                    <input type="number" className="input-field w-full" value={investAmt}
                      onChange={e => setInvestAmt(Number(e.target.value))} min={1000} step={5000} />
                  </div>
                  <div>
                    <label className="text-xs text-cse-muted block mb-1.5">Holding period: {investYears} years</label>
                    <input type="range" className="w-full accent-cse-gold" value={investYears}
                      onChange={e => setInvestYears(Number(e.target.value))} min={1} max={15} />
                    <div className="flex justify-between text-xs text-cse-muted mt-0.5"><span>1yr</span><span>15yr</span></div>
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm text-cse-muted cursor-pointer">
                      <input type="checkbox" className="accent-cse-gold" checked={reinvestDiv}
                        onChange={e => setReinvestDiv(e.target.checked)} />
                      Reinvest dividends (DRIP) — compounds returns faster
                    </label>
                  </div>
                </div>

                <div className="text-xs text-cse-muted bg-cse-navy rounded p-2">
                  Using 3-year avg EPS growth of <span className="text-white font-mono">{avg3yrEPSGrowth.toFixed(1)}%</span> and dividend yield of <span className="text-cse-gold font-mono">{c.divYield}%</span>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: `Value after ${investYears} yrs`, value: fmtLKR(proj.finalValue), color: 'text-white' },
                  { label: 'Total profit',                   value: fmtLKR(proj.totalReturn), color: 'text-cse-up' },
                  { label: 'Total return %',                 value: fmtPct(proj.totalReturnPct), color: proj.totalReturnPct >= 0 ? 'text-cse-up' : 'text-cse-down' },
                  { label: 'CAGR (annual)',                  value: proj.cagr + '%', color: 'text-cse-gold' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card p-3">
                    <div className="text-xs text-cse-muted mb-1">{label}</div>
                    <div className={`font-mono text-xl ${color}`}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="card p-4">
                <div className="text-sm font-medium text-white mb-3">Projected growth curve</div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={projData}>
                    <defs>
                      <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3050" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#8B9BB4' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#8B9BB4' }} width={50} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => fmtLKR(v)} />
                    <Area type="monotone" dataKey="value" stroke="#C9A84C" fill="url(#projGrad)" strokeWidth={2} name="Portfolio value" dot={{ fill: '#C9A84C', r: 3 }} />
                    {!reinvestDiv && <Line type="monotone" dataKey="cumDiv" stroke="#1DB88A" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Cash dividends" />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs text-cse-muted bg-cse-navy/60 rounded-lg p-3 border border-cse-border">
                ⚠ This is a simplified projection based on historical EPS growth. Actual returns depend on market conditions, interest rates, management changes, and economic factors. Not financial advice. Consult a licensed investment advisor.
              </div>
            </>
          )}

          {/* ── RELATED ── */}
          {tab === 'Related' && (
            <>
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-cse-gold" />
                  <span className="text-sm font-medium text-white">Owner group</span>
                </div>
                <div className="text-white font-medium">{c.ownerGroup}</div>
                <div className="text-cse-muted text-sm mt-1">
                  {c.relatedCompanies?.length > 0
                    ? `Also owns stakes in: ${c.relatedCompanies.join(', ')}`
                    : 'No other listed companies in this group.'
                  }
                </div>
                <div className="mt-3 text-xs bg-cse-warn/10 text-cse-warn rounded p-2">
                  ⚠ Concentration risk: investing in multiple companies from the same owner group increases exposure to that group's business, legal, and governance risks.
                </div>
              </div>

              {c.relatedCompanies?.length > 0 && (
                <div className="card p-4">
                  <div className="text-sm font-medium text-white mb-3">Same-owner listed tickers</div>
                  <div className="flex flex-wrap gap-2">
                    {c.relatedCompanies.map(r => (
                      <span key={r} className="font-mono text-cse-gold border border-cse-gold/30 bg-cse-gold/10 px-3 py-1.5 rounded-lg text-sm">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} className="text-cse-tealt" />
                  <span className="text-sm font-medium text-white">Annual report filings</span>
                </div>
                <div className="space-y-2">
                  {[2024, 2023, 2022, 2021, 2020].map(yr => (
                    <div key={yr} className="flex items-center justify-between py-2 border-b border-cse-border last:border-0">
                      <div>
                        <span className="text-sm text-white">Annual Report {yr}</span>
                        <span className="ml-2 text-xs text-cse-muted">PDF — cse.lk</span>
                      </div>
                      <a
                        href={`https://www.cse.lk/pages/company-profile/company-profile.component.html?symbol=${c.symbol}`}
                        target="_blank" rel="noreferrer"
                        className="text-xs text-cse-tealt hover:text-white border border-cse-tealt/30 px-2 py-1 rounded"
                        onClick={e => e.stopPropagation()}
                      >
                        View on CSE ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
