"use client";

interface Props {
  isPlaying: boolean;
  isReady: boolean;
  onPlayPause: () => void;
  onStop: () => void;
}

export function PlaybackControls({
  isPlaying,
  isReady,
  onPlayPause,
  onStop,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPlayPause}
        disabled={!isReady}
        className="w-14 h-14 flex items-center justify-center
                   bg-github-green-4 text-github-bg rounded-full
                   hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all text-xl font-bold"
        aria-label={isPlaying ? "일시정지" : "재생"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <button
        onClick={onStop}
        disabled={!isReady}
        className="w-10 h-10 flex items-center justify-center
                   bg-github-bg-secondary border border-github-border rounded-full
                   hover:border-github-accent disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        aria-label="정지"
      >
        ⏹
      </button>
    </div>
  );
}
