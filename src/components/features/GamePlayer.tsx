"use client";

import { useState, useCallback, useEffect } from "react";
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

  // 자동 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <GameVisualizer
        contributions={contributions}
        stats={stats}
        isPlaying={isPlaying}
        onComplete={handleComplete}
      />
    </div>
  );
}
