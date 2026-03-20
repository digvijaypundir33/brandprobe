'use client';

interface ActionCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate?: string;
  category: string;
  locked?: boolean;
}

const priorityConfig = {
  high: {
    badge: 'bg-red-100 text-red-700',
    label: 'Critical',
  },
  medium: {
    badge: 'bg-amber-100 text-amber-700',
    label: 'High Impact',
  },
  low: {
    badge: 'bg-slate-100 text-slate-600',
    label: 'Quick Fix',
  },
};

const categoryConfig: Record<string, { bg: string; text: string }> = {
  Messaging: { bg: 'bg-violet-100', text: 'text-violet-700' },
  SEO: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Conversion: { bg: 'bg-green-100', text: 'text-green-700' },
  Technical: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Design: { bg: 'bg-pink-100', text: 'text-pink-700' },
  Content: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
};

export default function ActionCard({
  title,
  description,
  priority,
  timeEstimate,
  category,
  locked = false,
}: ActionCardProps) {
  const priorityStyle = priorityConfig[priority];
  const categoryStyle = categoryConfig[category] || { bg: 'bg-slate-100', text: 'text-slate-600' };

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-soft card-lift relative ${
        locked ? 'overflow-hidden' : ''
      }`}
    >
      {/* Category & Priority badges */}
      <div className={`flex items-center justify-between mb-4 ${locked ? 'blur-sm' : ''}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text}`}>
          {category}
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${priorityStyle.badge}`}>
          {priorityStyle.label}
        </span>
      </div>

      {/* Title */}
      <h4 className={`font-[family-name:var(--font-space-grotesk)] font-bold text-gray-900 mb-2 ${locked ? 'blur-sm select-none' : ''}`}>
        {title}
      </h4>

      {/* Description */}
      <p className={`text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2 ${locked ? 'blur-sm select-none' : ''}`}>
        {description}
      </p>

      {/* Time estimate */}
      {timeEstimate && (
        <div className={`flex items-center gap-1.5 text-xs text-slate-500 ${locked ? 'blur-sm' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{timeEstimate}</span>
        </div>
      )}

      {/* Locked overlay */}
      {locked && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Upgrade to Pro</span>
          </div>
        </div>
      )}
    </div>
  );
}
