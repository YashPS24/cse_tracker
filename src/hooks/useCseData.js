import { useState, useEffect, useCallback, useRef } from 'react'
import * as api from '../utils/cseApi'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes
const LIVE = api.LIVE_AVAILABLE

const titleCase = (s = '') => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

/** Hook: market summary, status, ASPI and S&P SL20 with auto-refresh */
export function useMarketSummary() {
  const [data, setData]     = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(LIVE)
  const [error, setError]   = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch = useCallback(async () => {
    if (!LIVE) return
    try {
      setError(null)
      const [summary, mktStatus, aspi, snp] = await Promise.all([
        api.fetchMarketSummary(),
        api.fetchMarketStatus(),
        api.fetchASPIData().catch(() => null),
        api.fetchSnpData().catch(() => null),
      ])
      setData({
        ...summary,
        turnover: summary?.tradeVolume, // CSE calls the LKR turnover "tradeVolume"
        aspi: aspi?.value, aspiChangePct: aspi?.percentage,
        sp20: snp?.value, sp20ChangePct: snp?.percentage,
      })
      const text = mktStatus?.status || ''
      setStatus({ text, isOpen: /trading|open/i.test(text) && !/clos/i.test(text) })
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!LIVE) return
    fetch()
    const id = setInterval(fetch, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetch])

  return { data, status, loading, error, lastUpdated, refresh: fetch }
}

/** Hook: live trade list with auto-refresh */
export function useTrades() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(LIVE)
  const [error, setError]   = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch = useCallback(async () => {
    if (!LIVE) return
    try {
      setError(null)
      const res = await api.fetchTradeSummary()
      const list = Array.isArray(res) ? res : (res?.reqTradeSummery || res?.reqData || [])
      setTrades(list)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!LIVE) return
    fetch()
    const id = setInterval(fetch, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetch])

  return { trades, loading, error, lastUpdated, refresh: fetch }
}

/** Hook: top movers (gainers + losers) */
export function useTopMovers() {
  const [gainers, setGainers] = useState([])
  const [losers,  setLosers]  = useState([])
  const [loading, setLoading] = useState(LIVE)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    if (!LIVE) return
    try {
      setError(null)
      const [g, l] = await Promise.all([api.fetchTopGainers(), api.fetchTopLosers()])
      const norm = (x) => (Array.isArray(x) ? x : (x?.reqData || [])).map((m) => ({ ...m, percentageChange: m.changePercentage ?? m.percentageChange }))
      setGainers(norm(g))
      setLosers(norm(l))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!LIVE) return
    fetch()
    const id = setInterval(fetch, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetch])

  return { gainers, losers, loading, error, refresh: fetch }
}

/** Hook: latest financial + general announcements — checks every 10 min */
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(LIVE)
  const [error, setError]     = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const prevCountRef = useRef(0)
  const [hasNew, setHasNew]   = useState(false)

  const fetch = useCallback(async () => {
    if (!LIVE) return
    try {
      setError(null)
      const [fin, gen] = await Promise.all([api.fetchFinancialAnnouncements(), api.fetchAnnouncements()])
      const finList = (fin?.reqFinancialAnnouncemnets || fin?.reqData || []).map((a) => ({
        title: a.fileText, companyName: a.name, symbol: a.symbol,
        createdDate: a.manualDate || a.uploadedDate, attachmentPath: a.path, category: 'financial',
      }))
      const genList = (gen?.approvedAnnouncements || gen?.reqData || []).map((a) => ({
        title: titleCase(a.announcementCategory || 'Announcement'), companyName: a.company, symbol: a.symbol,
        createdDate: a.createdDate, description: (a.remarks || '').trim(),
        category: /dividend/i.test(a.announcementCategory || '') ? 'dividend' : 'general',
      }))
      const combined = [...finList, ...genList]
        .sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0))
      if (prevCountRef.current > 0 && combined.length > prevCountRef.current) setHasNew(true)
      prevCountRef.current = combined.length
      setAnnouncements(combined)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!LIVE) return
    fetch()
    const id = setInterval(fetch, 10 * 60 * 1000) // 10 min
    return () => clearInterval(id)
  }, [fetch])

  return { announcements, loading, error, lastUpdated, hasNew, clearNew: () => setHasNew(false), refresh: fetch }
}

// CSE needs a numeric stock id for charts; look it up once per symbol.
const infoCache = new Map()
function companyInfo(symbol) {
  if (!infoCache.has(symbol)) infoCache.set(symbol, api.fetchCompanyInfo(symbol).then((res) => res?.reqSymbolInfo || null).catch((e) => { infoCache.delete(symbol); throw e }))
  return infoCache.get(symbol)
}

/** Hook: single company detail from CSE */
export function useCompanyDetail(symbol) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    setData(null)
    if (!symbol || !LIVE) return
    setLoading(true)
    setError(null)
    companyInfo(symbol)
      .then((info) => setData(info && { ...info, percentageChange: info.changePercentage, volume: info.tdyShareVolume }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [symbol])

  return { data, loading, error }
}

// App period labels → CSE chart periods (6M is cut from the 1-year series; 5Y isn't offered by CSE)
const PERIOD = { '1D': 1, '1W': 2, '1M': 3, '3M': 4, '6M': 5, '1Y': 5 }

/** Hook: stock chart data */
export function useStockChart(symbol, period = '3M') {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!symbol || !LIVE) { setChartData([]); return }
    let cancelled = false
    setLoading(true)
    companyInfo(symbol)
      .then((info) => (info?.id ? api.fetchStockChart(info.id, PERIOD[period] || 4) : null))
      .then((res) => {
        if (cancelled) return
        let raw = res?.chartData || []
        if (period === '6M') { const from = Date.now() - 182 * 864e5; raw = raw.filter((d) => d.t >= from) }
        const intraday = period === '1D'
        setChartData(raw.filter((d) => d.p != null).map((d) => ({
          date: new Date(d.t).toLocaleString('en-LK', intraday ? { hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: 'short' }),
          price: d.p,
        })))
      })
      .catch(() => !cancelled && setChartData([]))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [symbol, period])

  return { chartData, loading }
}
