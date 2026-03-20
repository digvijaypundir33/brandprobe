'use client';

type TabType = 'overview' | 'messaging' | 'seo' | 'content' | 'ads' | 'conversion' | 'distribution' | 'aiSearch' | 'technical' | 'brandHealth' | 'designAuth';

interface Tab {
  id: TabType;
  label: string;
  score?: number;
  isFree: boolean;
  locked?: boolean;
}

interface ReportTabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  scores: {
    messaging: number;
    seo: number;
    content: number;
    ads: number;
    conversion: number;
    distribution: number;
    aiSearch: number;
    technical: number;
    brandHealth: number;
    designAuth: number;
  };
  hasFullAccess: boolean;
}

export default function ReportTabNav({
  activeTab,
  onTabChange,
  scores,
  hasFullAccess,
}: ReportTabNavProps) {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', isFree: true },
    { id: 'messaging', label: 'Messaging', score: scores.messaging, isFree: true },
    { id: 'seo', label: 'SEO', score: scores.seo, isFree: true },
    { id: 'content', label: 'Content', score: scores.content, isFree: true },
    { id: 'ads', label: 'Ads', score: scores.ads, isFree: true },
    { id: 'conversion', label: 'CRO', score: scores.conversion, isFree: false, locked: !hasFullAccess },
    { id: 'distribution', label: 'Channels', score: scores.distribution, isFree: false, locked: !hasFullAccess },
    { id: 'aiSearch', label: 'AI', score: scores.aiSearch, isFree: false, locked: !hasFullAccess },
    { id: 'technical', label: 'Tech', score: scores.technical, isFree: false, locked: !hasFullAccess },
    { id: 'brandHealth', label: 'Brand', score: scores.brandHealth, isFree: false, locked: !hasFullAccess },
    { id: 'designAuth', label: 'Design', score: scores.designAuth, isFree: false, locked: !hasFullAccess },
  ];

  return (
    <div className="mb-8 md:mb-10 border-b border-slate-200 overflow-x-auto custom-scrollbar">
      <nav className="flex w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.locked && onTabChange(tab.id)}
            className={`flex-1 px-3 md:px-4 py-3 border-b-2 font-medium text-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#5B5BD5] text-[#5B5BD5] font-bold'
                : tab.locked
                ? 'border-transparent text-slate-400 opacity-60 cursor-not-allowed'
                : 'border-transparent text-slate-500 hover:text-[#5B5BD5]'
            }`}
            disabled={tab.locked}
          >
            <span>{tab.label}</span>

            {/* Score badge */}
            {tab.score !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeTab === tab.id
                  ? 'bg-[#5B5BD5]/10 text-[#5B5BD5]'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.score}
              </span>
            )}

            {/* Lock icon for locked tabs */}
            {tab.locked && (
              <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
