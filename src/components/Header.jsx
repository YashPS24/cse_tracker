import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, Bell, Activity } from 'lucide-react'

export default function Header({ marketData, marketStatus, lastUpdated, onRefresh, hasNewAnnouncements, liveUnavailable }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const isOpen = !!marketStatus?.isOpen
  const statusText = marketStatus?.text
  const aspi   = marketData?.aspi
  const sp20   = marketData?.sp20
  const pct = (v) => (v == null ? null : <span className={`text-xs font-mono ${v >= 0 ? 'text-cse-up' : 'text-cse-down'}`}>{v >= 0 ? '+' : ''}{Number(v).toFixed(2)}%</span>)
  const turnover = marketData?.turnover

  return (
    <header className="border-b border-cse-border bg-cse-navy/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cse-gold/10 border border-cse-gold/30 flex items-center justify-center">
            <TrendingUp size={16} className="text-cse-gold" />
          </div>
          <div>
            <div className="font-display text-white text-base leading-none">CSE Tracker</div>
            <div className="text-cse-muted text-xs mt-0.5">Colombo Stock Exchange</div>
          </div>
        </div>

        {/* Market status bar */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'pulse-dot' : 'bg-cse-muted'}`} />
            <span className={isOpen ? 'text-cse-up font-medium' : 'text-cse-muted'}>
              {statusText ? statusText : liveUnavailable ? 'Live data: local only' : 'Market status…'}
            </span>
          </div>

          {aspi && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-cse-muted text-xs">ASPI</span>
              <span className="font-mono text-white font-medium">{Number(aspi).toLocaleString()}</span>{pct(marketData?.aspiChangePct)}
            </div>
          )}

          {sp20 && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-cse-muted text-xs">S&P SL20</span>
              <span className="font-mono text-white font-medium">{Number(sp20).toLocaleString()}</span>{pct(marketData?.sp20ChangePct)}
            </div>
          )}

          {turnover && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-cse-muted text-xs">Turnover</span>
              <span className="font-mono text-cse-gold font-medium">
                LKR {(Number(turnover) / 1e6).toFixed(1)}M
              </span>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <div className="font-mono text-white text-sm">{time.toLocaleTimeString('en-LK')}</div>
            {lastUpdated && (
              <div className="text-cse-muted text-xs">
                Updated {lastUpdated.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-lg border border-cse-border text-cse-muted hover:text-white hover:border-white/30 transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={14} />
          </button>

          {hasNewAnnouncements && (
            <div className="relative">
              <Bell size={16} className="text-cse-gold" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cse-down" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
