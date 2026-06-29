import { useState } from 'react'
import { Bell, FileText, TrendingUp, AlertCircle, ChevronDown, ExternalLink } from 'lucide-react'

const CATEGORY_ICONS = {
  financial: TrendingUp,
  general:   FileText,
  dividend:  Bell,
  default:   AlertCircle,
}

const CATEGORY_COLORS = {
  financial: 'text-cse-up border-cse-up/30 bg-cse-up/10',
  general:   'text-cse-muted border-cse-border bg-white/5',
  dividend:  'text-cse-gold border-cse-gold/30 bg-cse-gold/10',
  default:   'text-cse-warn border-cse-warn/30 bg-cse-warn/10',
}

function AnnouncementItem({ item }) {
  const [open, setOpen] = useState(false)
  const category = item.category || 'general'
  const Icon   = CATEGORY_ICONS[category] || CATEGORY_ICONS.default
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.default

  const title   = item.subject || item.title || item.headline || 'Announcement'
  const company = item.companyName || item.company || item.symbol || ''
  const date    = item.createdDate || item.date || item.announcementDate || ''
  const pdfUrl  = item.attachmentPath || item.pdfUrl || item.link || ''

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="border-b border-cse-border last:border-0">
      <button
        className="w-full text-left px-4 py-3 hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded flex items-center justify-center border text-xs ${colors}`}>
            <Icon size={12} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-white font-medium leading-snug line-clamp-2">{title}</div>
              <ChevronDown size={14} className={`text-cse-muted flex-shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              {company && <span className="font-mono text-xs text-cse-gold">{company}</span>}
              {formattedDate && <span className="text-xs text-cse-muted">{formattedDate}</span>}
              <span className={`text-xs px-1.5 py-0.5 rounded border ${colors}`}>{category}</span>
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 pl-13">
          <div className="ml-9 space-y-2">
            {item.description || item.body ? (
              <p className="text-sm text-cse-muted leading-relaxed">{item.description || item.body}</p>
            ) : (
              <p className="text-sm text-cse-muted">No further details available in this announcement.</p>
            )}
            {pdfUrl && (
              <a
                href={pdfUrl.startsWith('http') ? pdfUrl : `https://cdn.cse.lk/${pdfUrl}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cse-tealt hover:text-white border border-cse-tealt/30 px-2 py-1 rounded transition-colors"
              >
                <FileText size={11} /> View PDF on CSE <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AnnouncementsFeed({ announcements, loading, lastUpdated, hasNew, onClearNew }) {
  const [filter, setFilter] = useState('all')
  const [showCount, setShowCount] = useState(20)

  const filtered = announcements.filter(a =>
    filter === 'all' || a.category === filter
  )

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cse-border">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-cse-gold" />
          <span className="text-sm font-medium text-white">Announcements & Reports</span>
          {hasNew && (
            <button
              onClick={onClearNew}
              className="text-xs bg-cse-down/20 text-cse-down border border-cse-down/30 px-2 py-0.5 rounded-full animate-pulse"
            >
              New
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-cse-muted hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <div className="w-2 h-2 rounded-full pulse-dot" title="Auto-refreshing" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-cse-border bg-cse-navy/40">
        {['all','financial','general','dividend'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${filter === f ? 'bg-cse-gold/15 text-cse-gold border border-cse-gold/20' : 'text-cse-muted hover:text-white'}`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-cse-muted self-center">{filtered.length} items</span>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="shimmer w-6 h-6 rounded flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="shimmer h-4 w-3/4 rounded" />
                <div className="shimmer h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-cse-muted text-sm">
          <Bell size={24} className="mx-auto mb-2 opacity-30" />
          <div>No announcements yet</div>
          <div className="text-xs mt-1">Auto-checks every 10 minutes</div>
        </div>
      ) : (
        <>
          {filtered.slice(0, showCount).map((item, i) => (
            <AnnouncementItem key={i} item={item} />
          ))}
          {filtered.length > showCount && (
            <button
              onClick={() => setShowCount(n => n + 20)}
              className="w-full py-3 text-sm text-cse-muted hover:text-white border-t border-cse-border transition-colors"
            >
              Load more ({filtered.length - showCount} remaining)
            </button>
          )}
        </>
      )}
    </div>
  )
}
