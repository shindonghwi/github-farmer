"use client";

import { useState, useCallback } from "react";
import { GameVisualizer } from "./GameVisualizer";
import { ContributionWeek, ContributionStats } from "@/lib/github/types";

interface Props {
  username: string;
  contributions: ContributionWeek[];
  stats: ContributionStats;
}

export function GamePlayer({
  username,
  contributions,
  stats,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleStart = useCallback(() => {
    setIsPlaying(true);
    setIsComplete(false);
  }, []);

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 게임 캔버스 */}
      <GameVisualizer
        contributions={contributions}
        stats={stats}
        isPlaying={isPlaying}
        onComplete={handleComplete}
      />

      {/* 시작 버튼 (시작 전에만 표시) */}
      {!isPlaying && !isComplete && (
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-[#238636] text-white font-semibold rounded-md
                     hover:bg-[#2ea043] transition-colors"
        >
          START
        </button>
      )}

      {/* 완료 메시지 */}
      {isComplete && (
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#238636] text-white font-semibold rounded-md
                     hover:bg-[#2ea043] transition-colors"
        >
          REPLAY
        </button>
      )}
    </div>
  );
}
