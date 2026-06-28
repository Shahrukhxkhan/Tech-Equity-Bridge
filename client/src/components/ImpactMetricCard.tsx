import React from 'react';
import type { ReactNode } from 'react';

interface ImpactMetricCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export function ImpactMetricCard({
  icon,
  value,
  label,
  subtitle,
  trend,
  trendValue,
  variant = 'primary',
}: ImpactMetricCardProps) {
  const variantColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    neutral: 'text-gray-600',
  };

  const bgColors = {
    primary: 'bg-primary-light',
    secondary: 'bg-secondary-light',
    accent: 'bg-accent-light',
    neutral: 'bg-gray-100',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className={`flex-center w-10 h-10 rounded-lg ${bgColors[variant]}`}>
          <div className={`w-5 h-5 ${variantColors[variant]}`}>{icon}</div>
        </div>
        {trend && trendValue && (
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-accent' : 'text-gray-500'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>

      <div className="metric-value" style={{
        color: variant === 'primary' ? '#1D9E75' : 
               variant === 'secondary' ? '#534AB7' : 
               variant === 'accent' ? '#BA7517' : '#374151'
      }}>
        {value}
      </div>

      <div className="metric-label">{label}</div>

      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}

export default ImpactMetricCard;
