import React from 'react';

interface MatchScoreBarProps {
  score: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScoreBar({ score, label = 'Match Score', size = 'md' }: MatchScoreBarProps) {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return '#1D9E75'; // teal-green (excellent)
    if (s >= 60) return '#534AB7'; // civic purple (good)
    if (s >= 40) return '#BA7517'; // amber (fair)
    return '#9CA3AF'; // gray (poor)
  };

  const color = getColor(score);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs font-medium text-gray-700">{label}</span>}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full overflow-hidden" style={{ height: '6px' }}>
          <div
            className={`${sizeClasses[size]} rounded-full transition-all duration-300`}
            style={{
              width: `${score}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900 min-w-fit">{score}%</span>
      </div>
    </div>
  );
}

export default MatchScoreBar;
