interface Props {
  totalContributions: number;
  totalNotes: number;
  averageTempo: number;
}

export function PlayerStats({
  totalContributions,
  totalNotes,
  averageTempo,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-github-bg-secondary rounded-lg border border-github-border">
      <div className="text-center">
        <div className="text-2xl font-bold text-github-green-4">
          {totalContributions.toLocaleString()}
        </div>
        <div className="text-sm text-github-text-muted">총 기여</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-github-accent">
          {totalNotes.toLocaleString()}
        </div>
        <div className="text-sm text-github-text-muted">총 노트</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-github-text">
          {averageTempo}
        </div>
        <div className="text-sm text-github-text-muted">평균 BPM</div>
      </div>
    </div>
  );
}
