// CSE unofficial API — base URL discovered by the community
// See: github.com/GH0STH4CKER/Colombo-Stock-Exchange-CSE-API-Documentation
const BASE = 'https://www.cse.lk/api'

// Generic POST helper with CORS proxy fallback
async function post(endpoint, body = {}) {
  // Direct call first (works if CSE has CORS headers)
  try {
    const res = await fetch(`${BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString(),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    // If CORS blocks the direct call, route through a public CORS proxy
    const proxy = 'https://corsproxy.io/?' + encodeURIComponent(`${BASE}/${endpoint}`)
    const res = await fetch(proxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString(),
    })
    if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`)
    return await res.json()
  }
}

// ── Public API methods ──────────────────────────────────────────

/** Today's trade summary for ALL securities */
export async function fetchTradeSummary() {
  return post('tradeSummary', {})
}

/** Detailed info for a single stock by symbol e.g. "JKH.N0000" */
export async function fetchCompanyInfo(symbol) {
  return post('companyInfoSummery', { symbol })
}

/** Top gaining stocks today */
export async function fetchTopGainers() {
  return post('topGainers', {})
}

/** Top losing stocks today */
export async function fetchTopLosers() {
  return post('topLooses', {})
}

/** Most active by volume */
export async function fetchMostActive() {
  return post('mostActiveTrades', {})
}

/** Financial announcements (annual/quarterly reports) */
export async function fetchFinancialAnnouncements() {
  return post('getFinancialAnnouncement', {})
}

/** All general announcements/notices */
export async function fetchAnnouncements() {
  return post('approvedAnnouncement', {})
}

/** Market summary (ASPI, S&P SL20, turnover) */
export async function fetchMarketSummary() {
  return post('marketSummery', {})
}

/** All sectors */
export async function fetchAllSectors() {
  return post('allSectors', {})
}

/** ASPI index chart data */
export async function fetchASPIData() {
  return post('aspiData', {})
}

/** Chart data for a specific stock */
export async function fetchStockChart(stockId, period = '1M') {
  return post('companyChartDataByStock', { stockId, period })
}

/** Market open/close status */
export async function fetchMarketStatus() {
  return post('marketStatus', {})
}
