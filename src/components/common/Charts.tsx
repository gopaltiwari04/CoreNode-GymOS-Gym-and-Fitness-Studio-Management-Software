import React, { useState } from 'react';

// Crisp SVG Trend Line Chart with gradient area fill and hover tooltip
export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export const TrendLineChart: React.FC<{
  data: DataPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  formatValue?: (val: number) => string;
  showPoints?: boolean;
}> = ({
  data,
  height = 220,
  color = '#0d9488', // teal-600
  secondaryColor = '#6366f1', // indigo-500
  formatValue = (v) => String(v),
  showPoints = true
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data available</div>;
  }

  const values = data.map(d => d.value);
  const secondaryValues = data.filter(d => d.secondaryValue !== undefined).map(d => d.secondaryValue as number);
  const allValues = [...values, ...secondaryValues];
  const maxVal = Math.max(...allValues, 10) * 1.15;
  const minVal = 0;

  const width = 600;
  const paddingX = 40;
  const paddingY = 24;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Build SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${getX(0)},${height - paddingY} L ${points.join(' L ')} L ${getX(data.length - 1)},${height - paddingY} Z`;

  // Secondary line if present
  const hasSecondary = data.some(d => d.secondaryValue !== undefined);
  const secondaryPoints = hasSecondary ? data.map((d, i) => `${getX(i)},${getY(d.secondaryValue || 0)}`) : [];
  const secondaryPathD = hasSecondary ? `M ${secondaryPoints.join(' L ')}` : '';

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = height - paddingY - pct * chartHeight;
          const val = minVal + pct * (maxVal - minVal);
          return (
            <g key={i}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={paddingX - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                {formatValue(Math.round(val))}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Primary Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Secondary Line */}
        {hasSecondary && (
          <path d={secondaryPathD} fill="none" stroke={secondaryColor} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
        )}

        {/* Data points & Interactive hover anchors */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.value);
          const isHovered = hoverIndex === i;

          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="1" />
              )}

              {showPoints && (
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
              )}

              {/* X Axis label */}
              <text x={x} y={height - 6} textAnchor="middle" className="text-[11px] fill-slate-500 font-medium">
                {d.label}
              </text>

              {/* Invisible wide hit area */}
              <rect x={x - 20} y={paddingY} width="40" height={chartHeight} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoverIndex !== null && data[hoverIndex] && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg border border-slate-700"
          style={{
            left: `${((getX(hoverIndex)) / width) * 100}%`,
            top: `${(getY(data[hoverIndex].value) / height) * 100}%`,
            marginTop: '-10px'
          }}
        >
          <div className="font-semibold text-slate-200">{data[hoverIndex].label}</div>
          <div className="text-emerald-400 font-mono font-medium">{formatValue(data[hoverIndex].value)}</div>
          {data[hoverIndex].secondaryValue !== undefined && (
            <div className="text-indigo-300 font-mono text-[10px]">
              Exp: {formatValue(data[hoverIndex].secondaryValue || 0)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Clean Vertical Bar Chart
export const BarChartComponent: React.FC<{
  data: { label: string; value: number; color?: string }[];
  height?: number;
  formatValue?: (val: number) => string;
}> = ({ data, height = 200, formatValue = (v) => String(v) }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-44 flex items-center justify-center text-slate-400 text-sm">No data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.value), 5) * 1.15;
  const width = 500;
  const paddingX = 40;
  const paddingY = 24;
  const chartHeight = height - paddingY * 2;
  const chartWidth = width - paddingX * 2;
  const barWidth = Math.min(36, (chartWidth / data.length) * 0.65);

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((pct, i) => {
          const y = height - paddingY - pct * chartHeight;
          const val = pct * maxVal;
          return (
            <g key={i}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={paddingX - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                {formatValue(Math.round(val))}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * chartHeight;
          const x = paddingX + (i + 0.5) * (chartWidth / data.length) - barWidth / 2;
          const y = height - paddingY - barHeight;
          const isHovered = hoverIndex === i;

          return (
            <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} className="cursor-pointer">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={d.color || '#0d9488'}
                opacity={isHovered ? 1 : 0.85}
                className="transition-all duration-150"
              />
              <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" className="text-[11px] fill-slate-600 font-medium">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hoverIndex !== null && data[hoverIndex] && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg border border-slate-700"
          style={{
            left: `${((paddingX + (hoverIndex + 0.5) * (chartWidth / data.length)) / width) * 100}%`,
            top: `${((height - paddingY - (data[hoverIndex].value / maxVal) * chartHeight) / height) * 100}%`,
            marginTop: '-8px'
          }}
        >
          <span className="font-medium text-slate-300">{data[hoverIndex].label}: </span>
          <span className="font-bold text-teal-400">{formatValue(data[hoverIndex].value)}</span>
        </div>
      )}
    </div>
  );
};

// SVG Donut Chart with Segment Highlight and Center Label
export const DonutChartComponent: React.FC<{
  data: { label: string; value: number; color: string }[];
  size?: number;
  innerRadiusRatio?: number;
  formatValue?: (val: number) => string;
}> = ({ data, size = 180, innerRadiusRatio = 0.65, formatValue = (v) => String(v) }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (total === 0) {
    return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data recorded</div>;
  }

  const radius = size / 2;
  const innerRadius = radius * innerRadiusRatio;
  const strokeWidth = radius - innerRadius;
  const centerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * centerRadius;

  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 overflow-visible">
          {data.map((slice, i) => {
            const fraction = slice.value / total;
            const strokeDasharray = `${circumference * fraction} ${circumference * (1 - fraction)}`;
            const strokeDashoffset = -accumulatedAngle * circumference;
            accumulatedAngle += fraction;
            const isHovered = hoverIndex === i;

            return (
              <circle
                key={i}
                cx={radius}
                cy={radius}
                r={centerRadius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-800">
            {hoverIndex !== null ? formatValue(data[hoverIndex].value) : formatValue(total)}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {hoverIndex !== null ? data[hoverIndex].label : 'Total'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 min-w-[140px]">
        {data.map((item, i) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className={`flex items-center justify-between gap-3 text-xs p-1 rounded cursor-pointer transition-colors ${
                hoverIndex === i ? 'bg-slate-100 font-semibold' : 'text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate max-w-[110px]">{item.label}</span>
              </div>
              <span className="font-mono text-slate-500 font-medium">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Funnel chart for lead pipeline
export const FunnelChartComponent: React.FC<{
  stages: { label: string; count: number; color?: string }[];
}> = ({ stages }) => {
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <div className="space-y-2.5 w-full">
      {stages.map((stage, idx) => {
        const pct = Math.round((stage.count / maxCount) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700">{stage.label}</span>
              <span className="font-mono font-semibold text-slate-900">{stage.count} leads</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(6, pct)}%`,
                  backgroundColor: stage.color || '#0d9488'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
