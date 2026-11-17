// CSE unofficial API (community-documented, no key needed)
// See: github.com/GH0STH4CKER/Colombo-Stock-Exchange-CSE-API-Documentation
//
// The CSE API refuses requests from other websites, so live data only works when this app runs on your own
// computer: `npm run dev` starts Vite, which forwards /cse-api/* to https://www.cse.lk/api/* (see vite.config.js).
// On the public GitHub Pages site there is no such forwarder, so live calls are skipped and the app shows its
// built-in company data instead.

/** True when the local forwarder is available (npm run dev, or a local build made with VITE_CSE_LIVE=1). */
export const LIVE_AVAILABLE = import.meta.env.DEV || import.meta.env.VITE_CSE_LIVE === '1'

const BASE = '/cse-api'

export class LiveUnavailableError extends Error {
  constructor() {
    super('Live CSE data is only available when CSE Tracker runs on your own computer (npm run dev).')
    this.name = 'LiveUnavailableError'
    this.unavailable = true
  }
}

async function post(endpoint, body = {}) {
  if (!LIVE_AVAILABLE) throw new LiveUnavailableError()
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  })
  if (!res.ok) throw new Error(`CSE API HTTP ${res.status}`)
  return res.json()
}

// ── Public API methods ──────────────────────────────────────────

/** Today's trade summary for ALL securities → { reqTradeSummery: [...] } */
export const fetchTradeSummary = () => post('tradeSummary')

/** Detailed info for one stock, e.g. "JKH.N0000" → { reqSymbolInfo: {...}, ... } */
export const fetchCompanyInfo = (symbol) => post('companyInfoSummery', { symbol })

/** Top gaining / losing stocks today → [ { symbol, price, change, changePercentage } ] */
export const fetchTopGainers = () => post('topGainers')
export const fetchTopLosers = () => post('topLooses')

/** Most active by volume */
export const fetchMostActive = () => post('mostActiveTrades')

/** Financial announcements → { reqFinancialAnnouncemnets: [...] } (CSE's spelling) */
export const fetchFinancialAnnouncements = () => post('getFinancialAnnouncement')

/** General announcements → { approvedAnnouncements: [...] } */
export const fetchAnnouncements = () => post('approvedAnnouncement')

/** Market summary → { tradeVolume (turnover, LKR), shareVolume, trades } */
export const fetchMarketSummary = () => post('marketSummery')

/** All Share Price Index and S&P SL20 → { value, change, percentage } */
export const fetchASPIData = () => post('aspiData')
export const fetchSnpData = () => post('snpData')

/** All sectors */
export const fetchAllSectors = () => post('allSectors')

/** Price history for a stock. stockId is the numeric id from companyInfoSummery (reqSymbolInfo.id).
 *  period: 1 = today (intraday), 2 = 1 week, 3 = 1 month, 4 = 3 months, 5 = 1 year → { chartData: [{ p, t, ... }] } */
export const fetchStockChart = (stockId, period) => post('companyChartDataByStock', { stockId, period })

/** Market status → { status: "Regular Trading" | "Market Close" | ... } */
export const fetchMarketStatus = () => post('marketStatus')
