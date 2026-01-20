"use client";

interface Props {
  progress: number; // 0 ~ 1
  currentWeek: number;
  totalWeeks: number;
}

export function ProgressBar({ progress, currentWeek, totalWeeks }: Props) {
  return (
    <div className="w-full space-y-2">
      <div className="relative h-2 bg-github-bg-secondary rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-github-green-4 transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-github-text-muted">
        <span>Week {currentWeek + 1}</span>
        <span>{totalWeeks} weeks</span>
      </div>
    </div>
  );
}
