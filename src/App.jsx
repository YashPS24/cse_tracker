import { useState, useCallback } from 'react'
import Header         from './components/Header'
import MarketOverview from './components/MarketOverview'
import CompanyList    from './components/CompanyList'
import CompanyDetail  from './components/CompanyDetail'
import AnnouncementsFeed from './components/AnnouncementsFeed'
import { useMarketSummary, useTopMovers, useTrades, useAnnouncements, useCompanyDetail } from './hooks/useCseData'
import { SEED_COMPANIES } from './data/seedCompanies'

const NAV_TABS = ['Dashboard', 'Companies', 'Announcements']

export default function App() {
  const [activeTab, setActiveTab]       = useState('Dashboard')
  const [selectedCompany, setSelectedCompany] = useState(null)

  const { data: marketData, status: marketStatus, loading: mktLoading, lastUpdated: mktUpdated, refresh: refreshMarket } = useMarketSummary()
  const { gainers, losers, loading: moversLoading } = useTopMovers()
  const { trades, loading: tradesLoading } = useTrades()
  const { announcements, loading: annLoading, lastUpdated: annUpdated, hasNew, clearNew, refresh: refreshAnn } = useAnnouncements()
  const { data: liveDetail } = useCompanyDetail(selectedCompany?.symbol)

  const handleRefresh = useCallback(() => {
    refreshMarket()
    refreshAnn()
  }, [refreshMarket, refreshAnn])

  return (
    <div className="min-h-screen bg-cse-navy font-body">
      <Header
        marketData={marketData}
        marketStatus={marketStatus}
        lastUpdated={mktUpdated}
        onRefresh={handleRefresh}
        hasNewAnnouncements={hasNew}
      />

      {/* Nav */}
      <div className="border-b border-cse-border bg-cse-navylt/50 sticky top-[57px] z-30 backdrop-blur">
        <div className="max-w-screen-2xl mx-auto px-4 flex gap-1 py-2">
          {NAV_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === 'Announcements') clearNew() }}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
              {tab === 'Announcements' && hasNew && (
                <span className="ml-1.5 w-2 h-2 rounded-full bg-cse-down inline-block" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">

        {activeTab === 'Dashboard' && (
          <>
            {/* Market overview strip */}
            <MarketOverview
              gainers={gainers}
              losers={losers}
              loading={moversLoading}
              sectors={[]} // populated from API when available
            />

            {/* Two-column layout: company list + announcement feed */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-white">Featured companies</h2>
                  <button
                    onClick={() => setActiveTab('Companies')}
                    className="text-xs text-cse-muted hover:text-white"
                  >
                    View all 200+ →
                  </button>
                </div>
                <CompanyList
                  companies={SEED_COMPANIES}
                  liveTrades={trades}
                  onSelectCompany={setSelectedCompany}
                />
              </div>
              <div>
                <div className="mb-3">
                  <h2 className="text-sm font-medium text-white">Latest announcements</h2>
                </div>
                <AnnouncementsFeed
                  announcements={announcements}
                  loading={annLoading}
                  lastUpdated={annUpdated}
                  hasNew={hasNew}
                  onClearNew={clearNew}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'Companies' && (
          <div>
            <div className="mb-4">
              <h1 className="font-display text-2xl text-white">All Companies</h1>
              <p className="text-cse-muted text-sm mt-1">
                {SEED_COMPANIES.length} companies with 10-year financial history. Live prices update every 5 minutes.
              </p>
            </div>
            <CompanyList
              companies={SEED_COMPANIES}
              liveTrades={trades}
              onSelectCompany={setSelectedCompany}
            />
          </div>
        )}

        {activeTab === 'Announcements' && (
          <div>
            <div className="mb-4">
              <h1 className="font-display text-2xl text-white">Announcements & Filings</h1>
              <p className="text-cse-muted text-sm mt-1">
                Annual reports, quarterly results, dividend declarations, and notices from CSE. Auto-refreshes every 10 minutes.
              </p>
            </div>
            <AnnouncementsFeed
              announcements={announcements}
              loading={annLoading}
              lastUpdated={annUpdated}
              hasNew={hasNew}
              onClearNew={clearNew}
            />
          </div>
        )}

      </main>

      {/* Company detail slide-over panel */}
      {selectedCompany && (
        <CompanyDetail
          company={selectedCompany}
          liveDetail={liveDetail}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-cse-border mt-12 py-6 px-4">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-cse-muted">
          <div>
            CSE Tracker · Data sourced from <a href="https://www.cse.lk" target="_blank" rel="noreferrer" className="text-cse-gold hover:underline">cse.lk</a> unofficial API
          </div>
          <div>
            Not financial advice. Always verify with official filings at{' '}
            <a href="https://www.cse.lk/pages/listed-company/listed-company.component.html" target="_blank" rel="noreferrer" className="text-cse-gold hover:underline">cse.lk ↗</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
