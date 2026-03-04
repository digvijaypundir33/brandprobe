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
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-600 text-white',
    iconColor: 'text-green-600',
  },
  medium: {
    bg: 'bg-green-50/50',
    border: 'border-green-100',
    badge: 'bg-green-500 text-white',
    iconColor: 'text-green-500',
  },
  low: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badge: 'bg-gray-500 text-white',
    iconColor: 'text-gray-500',
  },
};

export default function ActionCard({
  title,
  description,
  priority,
  timeEstimate,
  category,
  locked = false,
}: ActionCardProps) {
  const config = priorityConfig[priority];

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 hover:shadow-md transition-shadow relative ${
        locked ? 'overflow-hidden' : ''
      }`}
    >
      <div className={`flex items-start justify-between mb-2 ${locked ? 'blur-sm' : ''}`}>
        <div className="flex items-center gap-2">
          <svg className={`w-5 h-5 ${config.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {category}
          </span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${config.badge}`}>
          {priority.toUpperCase()}
        </span>
      </div>
      <h4 className={`font-semibold text-gray-900 mb-1 ${locked ? 'blur-sm select-none' : ''}`}>{title}</h4>
      <p className={`text-sm text-gray-600 mb-2 ${locked ? 'blur-sm select-none' : ''}`}>{description}</p>
      {timeEstimate && (
        <div className={`flex items-center gap-1 text-xs text-gray-500 ${locked ? 'blur-sm' : ''}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{timeEstimate}</span>
        </div>
      )}
      {locked && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-4 h-4 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] text-gray-500 font-medium">Upgrade</span>
          </div>
        </div>
      )}
    </div>
  );
}
