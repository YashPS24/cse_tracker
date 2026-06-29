# CSE Tracker — Colombo Stock Exchange Investment Research

A free, open-source React dashboard for Sri Lankan retail investors. Tracks all 200+ CSE-listed companies with live prices, 10-year financial history, dividend analysis, and return predictions.

## Features

- **Live data** from the CSE unofficial API (`cse.lk/api`) — prices refresh every 5 min
- **Auto-updating announcements** — annual reports, quarterly results, dividend notices every 10 min
- **10-year financial history** — revenue, EPS, debt, dividends per company
- **Loan vs earnings analysis** — D/E ratio, interest coverage, risk scoring
- **Dividend tracker** — yield, payout ratio, 10-year dividend history, DRIP calculator
- **Return calculator** — project capital gains + dividends over 1–15 years
- **Same-owner company grouping** — see concentration risk across conglomerates
- **Sector filtering** — Banking, Diversified, Telecom, Healthcare, and more

## Quick Start (local development)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/cse-tracker.git
cd cse-tracker

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev
# Opens at http://localhost:5173/cse-tracker/
```

## Deploy to GitHub Pages (free hosting)

### Step 1 — Create a GitHub repo
1. Go to github.com → New repository
2. Name it `cse-tracker` (must match `vite.config.js` base path)
3. Set to Public (required for free GitHub Pages)

### Step 2 — Push your code
```bash
git init
git add .
git commit -m "Initial CSE tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cse-tracker.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. GitHub will auto-deploy on every push to `main`
4. Your app will be live at: `https://YOUR_USERNAME.github.io/cse-tracker/`

## Adding more companies

Edit `src/data/seedCompanies.js`. Copy the structure of any existing company entry and add financial data from annual reports available at [cse.lk](https://www.cse.lk/pages/listed-company/listed-company.component.html).

## Updating financial data each year

When companies publish new annual reports (usually March–June each year):
1. Open `src/data/seedCompanies.js`
2. Find the company
3. Add a new entry to the `financials[]` array for the new year
4. Push to GitHub — auto-deploys in ~2 minutes

## Data sources

- **Live prices & announcements**: `https://www.cse.lk/api/` (unofficial, no key needed)
- **Annual report PDFs**: `https://cdn.cse.lk/` (linked from CSE company profiles)
- **10-year financial history**: Manually compiled from CSE annual report filings

## Important disclaimer

This tool is for research and educational purposes only. It is not financial advice. Always verify information with official CSE filings before making investment decisions. Past performance does not guarantee future returns.

## Tech stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Recharts** for financial charts
- **Lucide React** for icons
- **GitHub Actions** for CI/CD
- **GitHub Pages** for free hosting
#