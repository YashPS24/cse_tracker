import { useState, useEffect, useCallback, useRef } from 'react'
import * as api from '../utils/cseApi'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

/** Hook: market summary + ASPI with auto-refresh */
export function useMarketSummary() {
  const [data, setData]     = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const [summary, mktStatus] = await Promise.all([
        api.fetchMarketSummary(),
        api.fetchMarketStatus(),
      ])
      setData(summary)
      setStatus(mktStatus)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetch])

  return { data, status, loading, error, lastUpdated, refresh: fetch }
}

/** Hook: live trade list with auto-refresh */
export function useTrades() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const res = await api.fetchTradeSummary()
      // CSE API returns array or wrapped object — normalise
      const list = Array.isArray(res) ? res : (res?.reqData || res?.data || [])
      setTrades(list)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
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
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const [g, l] = await Promise.all([
        api.fetchTopGainers(),
        api.fetchTopLosers(),
      ])
      setGainers(Array.isArray(g) ? g : (g?.reqData || []))
      setLosers(Array.isArray(l)  ? l : (l?.reqData || []))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { gainers, losers, loading, error, refresh: fetch }
}

/** Hook: latest financial announcements — checks every 10 min */
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const prevCountRef = useRef(0)
  const [hasNew, setHasNew]   = useState(false)

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const [fin, gen] = await Promise.all([
        api.fetchFinancialAnnouncements(),
        api.fetchAnnouncements(),
      ])
      const finList = Array.isArray(fin) ? fin : (fin?.reqData || [])
      const genList = Array.isArray(gen) ? gen : (gen?.reqData || [])
      const combined = [
        ...finList.map(a => ({ ...a, category: 'financial' })),
        ...genList.map(a => ({ ...a, category: 'general' })),
      ].sort((a, b) => new Date(b.date || b.createdDate || 0) - new Date(a.date || a.createdDate || 0))
      if (prevCountRef.current > 0 && combined.length > prevCountRef.current) {
        setHasNew(true)
      }
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
    fetch()
    const id = setInterval(fetch, 10 * 60 * 1000) // 10 min
    return () => clearInterval(id)
  }, [fetch])

  return { announcements, loading, error, lastUpdated, hasNew, clearNew: () => setHasNew(false), refresh: fetch }
}

/** Hook: single company detail from CSE */
export function useCompanyDetail(symbol) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!symbol) return
    setLoading(true)
    setError(null)
    api.fetchCompanyInfo(symbol)
      .then(res => setData(res?.reqData?.[0] || res))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [symbol])

  return { data, loading, error }
}

/** Hook: stock chart data */
export function useStockChart(stockId, period = '1M') {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!stockId) return
    setLoading(true)
    api.fetchStockChart(stockId, period)
      .then(res => {
        const raw = Array.isArray(res) ? res : (res?.reqData || [])
        setChartData(raw.map(d => ({ date: d.date || d.tradeDate, price: parseFloat(d.closingPrice || d.price || 0) })))
      })
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [stockId, period])

  return { chartData, loading }
}
