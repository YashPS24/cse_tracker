/**
 * Financial analysis helpers
 * These work on raw data from the CSE API or manually entered annual report data
 */

/** Debt/Equity ratio — below 1.5 is generally healthy for non-banks */
export function calcDebtEquity(totalDebt, totalEquity) {
  if (!totalEquity || totalEquity === 0) return null
  return +(totalDebt / totalEquity).toFixed(2)
}

/** Interest coverage ratio — EBIT / interest expense. Above 3× is safe */
export function calcInterestCoverage(ebit, interestExpense) {
  if (!interestExpense || interestExpense === 0) return null
  return +(ebit / interestExpense).toFixed(2)
}

/** Dividend yield — (annual dividend per share / price) × 100 */
export function calcDividendYield(annualDPS, price) {
  if (!price || price === 0) return 0
  return +((annualDPS / price) * 100).toFixed(2)
}

/** Payout ratio — dividends paid / net income. Above 80% may be unsustainable */
export function calcPayoutRatio(dividendsPaid, netIncome) {
  if (!netIncome || netIncome === 0) return null
  return +((dividendsPaid / netIncome) * 100).toFixed(1)
}

/** EPS growth YoY */
export function calcEPSGrowth(epsThis, epsPrev) {
  if (!epsPrev || epsPrev === 0) return null
  return +(((epsThis - epsPrev) / Math.abs(epsPrev)) * 100).toFixed(1)
}

/**
 * 5-year return projection including capital gain + dividends
 * @param {number} investAmount    - LKR invested
 * @param {number} annualGrowthPct - expected % price growth per year
 * @param {number} divYieldPct     - current dividend yield %
 * @param {number} years           - holding period
 * @param {boolean} reinvestDiv    - DRIP (dividend reinvestment)?
 */
export function projectReturn(investAmount, annualGrowthPct, divYieldPct, years, reinvestDiv = true) {
  const g = annualGrowthPct / 100
  const d = divYieldPct / 100
  let value = investAmount
  let cashDivTotal = 0
  const yearlyData = [{ year: 0, value: Math.round(investAmount), cumDiv: 0 }]

  for (let y = 1; y <= years; y++) {
    const div = value * d
    value = value * (1 + g)
    if (reinvestDiv) {
      value += div
    } else {
      cashDivTotal += div
    }
    yearlyData.push({
      year: y,
      value: Math.round(value),
      cumDiv: Math.round(cashDivTotal),
    })
  }

  const finalValue = Math.round(value)
  const totalReturn = finalValue + cashDivTotal - investAmount
  const totalReturnPct = +((totalReturn / investAmount) * 100).toFixed(1)
  const cagr = +(((Math.pow((finalValue + cashDivTotal) / investAmount, 1 / years)) - 1) * 100).toFixed(2)

  return { finalValue, cashDivTotal: Math.round(cashDivTotal), totalReturn: Math.round(totalReturn), totalReturnPct, cagr, yearlyData }
}

/** Risk score 1–5 based on D/E, interest coverage, EPS consistency */
export function calcRiskScore(de, icr, epsGrowthArr = []) {
  let score = 3 // default medium
  if (de !== null) {
    if (de < 0.5) score -= 1
    else if (de > 2.5) score += 1
    else if (de > 4)   score += 2
  }
  if (icr !== null) {
    if (icr > 6)       score -= 1
    else if (icr < 2)  score += 1
  }
  const negYears = epsGrowthArr.filter(g => g < 0).length
  if (negYears >= 3) score += 1
  if (negYears === 0) score -= 0.5
  return Math.min(5, Math.max(1, Math.round(score)))
}

export const RISK_LABELS = {
  1: { label: 'Very low',  color: '#1DB88A' },
  2: { label: 'Low',       color: '#1DB88A' },
  3: { label: 'Medium',    color: '#F0A500' },
  4: { label: 'High',      color: '#E84545' },
  5: { label: 'Very high', color: '#E84545' },
}

/** Format large LKR numbers — e.g. 1_500_000 → "LKR 1.5M" */
export function fmtLKR(val, unit = '') {
  if (val === null || val === undefined) return '—'
  const abs = Math.abs(val)
  const sign = val < 0 ? '-' : ''
  if (abs >= 1e9)  return `${sign}LKR ${(abs/1e9).toFixed(1)}B${unit}`
  if (abs >= 1e6)  return `${sign}LKR ${(abs/1e6).toFixed(1)}M${unit}`
  if (abs >= 1e3)  return `${sign}LKR ${(abs/1e3).toFixed(1)}K${unit}`
  return `${sign}LKR ${abs.toFixed(0)}${unit}`
}

export function fmtPct(val) {
  if (val === null || val === undefined) return '—'
  return `${val > 0 ? '+' : ''}${val}%`
}
