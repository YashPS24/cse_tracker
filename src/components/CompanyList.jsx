import { useState, useMemo } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import { SECTORS } from '../data/seedCompanies'
import { calcRiskScore, RISK_LABELS, fmtPct } from '../utils/finance'

const SORT_FIELDS = {
  name:     (a, b) => a.name.localeCompare(b.name),
  ticker:   (a, b) => a.ticker.localeCompare(b.ticker),
  price:    (a, b) => (a.price || 0) - (b.price || 0),
  pe:       (a, b) => (a.pe || 0) - (b.pe || 0),
  divYield: (a, b) => (a.divYield || 0) - (b.divYield || 0),
  de:       (a, b) => (a.de || 0) - (b.de || 0),
  eps:      (a, b) => (a.eps || 0) - (b.eps || 0),
}

function RiskBadge({ score }) {
  const r = RISK_LABELS[score] || RISK_LABELS[3]
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-md border font-medium"
      style={{ color: r.color, borderColor: r.color + '40', background: r.color + '12' }}
    >
      {r.label}
    </span>
  )
}

function SortIcon({ field, active, direction }) {
  if (!active) return <ChevronUp size={12} className="text-cse-muted/40" />
  return direction === 'asc'
    ? <ChevronUp size={12} className="text-cse-gold" />
    : <ChevronDown size={12} className="text-cse-gold" />
}

export default function CompanyList({ companies, liveTrades, onSelectCompany }) {
  const [search, setSearch]     = useState('')
  const [sector, setSector]     = useState('')
  const [divOnly, setDivOnly]   = useState(false)
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir]   = useState('asc')

  // Merge live prices from CSE API into seed data
  const enriched = useMemo(() => {
    const priceMap = {}
    if (liveTrades && liveTrades.length) {
      liveTrades.forEach(t => {
        const sym = t.symbol || t.stockSymbol || ''
        priceMap[sym] = {
          price:     parseFloat(t.lastTradedPrice || t.price || 0),
          change:    parseFloat(t.change || 0),
          changePct: parseFloat(t.percentageChange || 0),
          volume:    parseInt(t.volume || 0, 10),
        }
      })
    }
    return companies.map(c => {
      const live = priceMap[c.symbol] || {}
      const lastFin = c.financials?.slice(-1)[0] || {}
      const prevFin = c.financials?.slice(-2, -1)[0] || {}
      const epsGrowthArr = c.financials?.slice(1).map((f, i) => {
        const prev = c.financials[i]
        if (!prev?.eps || prev.eps === 0) return 0
        return ((f.eps - prev.eps) / Math.abs(prev.eps)) * 100
      }) || []
      const risk = calcRiskScore(c.de, c.icr, epsGrowthArr)
      return {
        ...c,
        price:     live.price || c.price,
        change:    live.change,
        changePct: live.changePct,
        volume:    live.volume,
        revenue10: c.financials?.map(f => f.revenue) || [],
        riskScore: risk,
        hasLive:   !!live.price,
      }
    })
  }, [companies, liveTrades])

  const filtered = useMemo(() => {
    let list = enriched.filter(c => {
      const q = search.toLowerCase()
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q) || c.ownerGroup?.toLowerCase().includes(q)
      const matchSector = !sector || c.sector === sector
      const matchDiv    = !divOnly || c.divYield > 0
      return matchSearch && matchSector && matchDiv
    })
    const dir = sortDir === 'asc' ? 1 : -1
    list.sort((a, b) => (SORT_FIELDS[sortField]?.(a, b) || 0) * dir)
    return list
  }, [enriched, search, sector, divOnly, sortField, sortDir])

  function toggleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function Th({ field, children }) {
    return (
      <th
        className="text-left text-xs text-cse-muted font-medium py-3 px-3 cursor-pointer hover:text-white select-none whitespace-nowrap"
        onClick={() => toggleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <SortIcon field={field} active={sortField === field} direction={sortDir} />
        </div>
      </th>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-cse-border flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cse-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company, ticker, owner…"
            className="input-field pl-8 w-64"
          />
        </div>
        <select
          value={sector}
          onChange={e => setSector(e.target.value)}
          className="input-field"
        >
          <option value="">All sectors</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-cse-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={divOnly}
            onChange={e => setDivOnly(e.target.checked)}
            className="accent-cse-gold"
          />
          Dividend paying only
        </label>
        <span className="ml-auto text-xs text-cse-muted">{filtered.length} companies</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cse-navy/60">
            <tr>
              <Th field="ticker">Ticker</Th>
              <Th field="name">Company</Th>
              <th className="text-left text-xs text-cse-muted font-medium py-3 px-3 whitespace-nowrap">Sector</th>
              <Th field="price">Price (LKR)</Th>
              <Th field="pe">P/E</Th>
              <Th field="eps">EPS</Th>
              <Th field="divYield">Div Yield</Th>
              <Th field="de">D/E</Th>
              <th className="text-left text-xs text-cse-muted font-medium py-3 px-3">Risk</th>
              <th className="text-left text-xs text-cse-muted font-medium py-3 px-3">10yr Revenue</th>
              <th className="py-3 px-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <CompanyRow key={c.ticker} company={c} onSelect={() => onSelectCompany(c)} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-10 text-cse-muted text-sm">
                  No companies match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MiniSparkline({ data }) {
  if (!data || data.length < 2) return <span className="text-cse-muted text-xs">—</span>
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 60, h = 24
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
  const isUp = data[data.length - 1] >= data[0]
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={isUp ? '#1DB88A' : '#E84545'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompanyRow({ company: c, onSelect }) {
  const hasChange = c.changePct !== undefined && c.changePct !== null
  return (
    <tr
      className="border-b border-cse-border hover:bg-white/[0.03] cursor-pointer transition-colors animate-slide-up"
      onClick={onSelect}
    >
      <td className="py-3 px-3">
        <span className="font-mono text-cse-gold text-sm">{c.ticker}</span>
        {c.hasLive && <span className="ml-1 text-xs text-cse-up">●</span>}
      </td>
      <td className="py-3 px-3">
        <div className="text-sm text-white font-medium max-w-[180px] truncate">{c.name}</div>
        <div className="text-xs text-cse-muted truncate max-w-[180px]">{c.ownerGroup}</div>
      </td>
      <td className="py-3 px-3">
        <span className="text-xs text-cse-muted border border-cse-border px-2 py-0.5 rounded">{c.sector}</span>
      </td>
      <td className="py-3 px-3">
        <div className="font-mono text-sm text-white">{c.price?.toFixed(2) || '—'}</div>
        {hasChange && (
          <div className={`text-xs font-mono ${c.changePct >= 0 ? 'text-cse-up' : 'text-cse-down'}`}>
            {fmtPct(c.changePct?.toFixed(2))}
          </div>
        )}
      </td>
      <td className="py-3 px-3 font-mono text-sm text-white">{c.pe || '—'}</td>
      <td className="py-3 px-3 font-mono text-sm text-white">{c.eps || '—'}</td>
      <td className="py-3 px-3">
        {c.divYield > 0
          ? <span className="font-mono text-cse-up text-sm">{c.divYield}%</span>
          : <span className="text-cse-muted text-sm">—</span>
        }
      </td>
      <td className="py-3 px-3">
        <span className={`font-mono text-sm ${c.de > 2 ? 'text-cse-down' : c.de > 1 ? 'text-cse-warn' : 'text-cse-up'}`}>
          {c.de}×
        </span>
      </td>
      <td className="py-3 px-3">
        <RiskBadge score={c.riskScore} />
      </td>
      <td className="py-3 px-3">
        <MiniSparkline data={c.revenue10} />
      </td>
      <td className="py-3 px-3">
        <button className="btn-ghost p-1.5" onClick={e => { e.stopPropagation(); onSelect() }}>
          <ExternalLink size={13} />
        </button>
      </td>
    </tr>
  )
}
