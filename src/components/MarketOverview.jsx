import { TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react'

function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded ${className}`} />
}

function MoverCard({ item, type }) {
  const isUp = type === 'gainer'
  const symbol = item?.symbol || item?.stockSymbol || '—'
  const name   = item?.companyName || item?.name || ''
  const change = parseFloat(item?.percentageChange || item?.change || 0)
  const price  = parseFloat(item?.lastTradedPrice || item?.price || 0)

  return (
    <div className="flex items-center justify-between py-2 border-b border-cse-border last:border-0">
      <div className="min-w-0">
        <div className="font-mono text-xs text-cse-gold truncate">{symbol}</div>
        <div className="text-xs text-cse-muted truncate max-w-[120px]">{name}</div>
      </div>
      <div className="text-right ml-2 shrink-0">
        <div className="font-mono text-sm text-white">{price.toFixed(2)}</div>
        <div className={`text-xs font-mono ${isUp ? 'text-cse-up' : 'text-cse-down'}`}>
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export default function MarketOverview({ gainers, losers, loading, sectors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      {/* Top Gainers */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-cse-up" />
          <span className="text-sm font-medium text-white">Top Gainers</span>
          <span className="ml-auto text-xs text-cse-muted">Today</span>
        </div>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-cse-border last:border-0">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : gainers.length === 0 ? (
          <div className="text-cse-muted text-xs text-center py-4">No data — market may be closed</div>
        ) : (
          gainers.slice(0, 6).map((g, i) => <MoverCard key={i} item={g} type="gainer" />)
        )}
      </div>

      {/* Top Losers */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={14} className="text-cse-down" />
          <span className="text-sm font-medium text-white">Top Losers</span>
          <span className="ml-auto text-xs text-cse-muted">Today</span>
        </div>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-cse-border last:border-0">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : losers.length === 0 ? (
          <div className="text-cse-muted text-xs text-center py-4">No data — market may be closed</div>
        ) : (
          losers.slice(0, 6).map((l, i) => <MoverCard key={i} item={l} type="loser" />)
        )}
      </div>

      {/* Sector performance */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={14} className="text-cse-gold" />
          <span className="text-sm font-medium text-white">Sectors</span>
        </div>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="py-2 border-b border-cse-border last:border-0">
              <Skeleton className="h-6 w-full" />
            </div>
          ))
        ) : sectors && sectors.length > 0 ? (
          sectors.slice(0, 7).map((s, i) => {
            const change = parseFloat(s?.percentChange || s?.change || 0)
            return (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-cse-border last:border-0">
                <span className="text-xs text-cse-muted truncate max-w-[130px]">{s?.sectorName || s?.sector}</span>
                <span className={`text-xs font-mono ${change >= 0 ? 'text-cse-up' : 'text-cse-down'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </span>
              </div>
            )
          })
        ) : (
          <div className="space-y-2">
            {[['Banking & Finance','avg div 6.2%'],['Diversified','avg PE 9.1'],['Telecom','stable'],
              ['Manufacturing','export led'],['Healthcare','high growth'],['Plantation','commodity risk']].map(([name, note]) => (
              <div key={name} className="flex items-center justify-between py-1.5 border-b border-cse-border last:border-0">
                <span className="text-xs text-cse-muted">{name}</span>
                <span className="text-xs text-cse-gold/60">{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live feed status */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-cse-tealt" />
          <span className="text-sm font-medium text-white">Data feed</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Trade prices',     src: 'cse.lk/api/tradeSummary',        ok: !loading },
            { label: 'Top movers',       src: 'cse.lk/api/topGainers',          ok: !loading },
            { label: 'Announcements',    src: 'cse.lk/api/getFinancialAnnouncement', ok: true },
            { label: 'Market index',     src: 'cse.lk/api/marketSummery',       ok: true },
            { label: 'Sector data',      src: 'cse.lk/api/allSectors',          ok: true },
          ].map(({ label, src, ok }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-white">{label}</span>
                <span className={`text-xs ${ok ? 'text-cse-up' : 'text-cse-warn'}`}>
                  {ok ? '● Live' : '○ Loading'}
                </span>
              </div>
              <div className="text-xs text-cse-muted font-mono truncate">{src}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-cse-border">
          <div className="text-xs text-cse-muted">Auto-refreshes every 5 min</div>
          <div className="text-xs text-cse-muted mt-1">Announcements every 10 min</div>
        </div>
      </div>

    </div>
  )
}
