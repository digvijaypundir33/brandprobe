'use client';

interface ActionCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate?: string;
  category: string;
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
}: ActionCardProps) {
  const config = priorityConfig[priority];

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-2">
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
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {timeEstimate && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
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
    </div>
  );
}
