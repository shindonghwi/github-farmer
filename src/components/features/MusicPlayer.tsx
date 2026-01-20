"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MusicEngine } from "@/lib/music/MusicEngine";
import { ContributionVisualizer } from "./ContributionVisualizer";
import { PlaybackControls } from "./PlaybackControls";
import { ProgressBar } from "./ProgressBar";
import { PlayerStats } from "./PlayerStats";
import { ContributionWeek } from "@/lib/github/types";
import { MusicNote, calculateWeeklyTempos } from "@/lib/music/mapper";

interface Props {
  username: string;
  contributions: ContributionWeek[];
  totalContributions: number;
}

interface Layers {
  drums: boolean;
  bass: boolean;
  chords: boolean;
  melody: boolean;
}

export function MusicPlayer({
  username,
  contributions,
  totalContributions,
}: Props) {
  const engineRef = useRef<MusicEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentNote, setCurrentNote] = useState<MusicNote | null>(null);
  const [progress, setProgress] = useState(0);
  const [layers, setLayers] = useState<Layers>({
    drums: false,
    bass: false,
    chords: false,
    melody: false,
  });

  // 통계 계산
  const totalNotes = contributions.reduce(
    (sum, week) => sum + week.contributionDays.length,
    0
  );
  const weeklyTempos = calculateWeeklyTempos(contributions);
  const averageTempo = Math.round(
    weeklyTempos.reduce((a, b) => a + b, 0) / weeklyTempos.length
  );

  useEffect(() => {
    engineRef.current = new MusicEngine();
    engineRef.current.loadContributions(contributions);

    engineRef.current.onNotePlay = (note: MusicNote) => {
      setCurrentNote(note);
    };

    engineRef.current.onProgressUpdate = (p: number) => {
      setProgress(p);
    };

    engineRef.current.onPlaybackEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentNote(null);
      setLayers({ drums: false, bass: false, chords: false, melody: false });
    };

    engineRef.current.onLayerChange = (newLayers: Layers) => {
      setLayers(newLayers);
    };

    setIsReady(true);

    return () => {
      engineRef.current?.dispose();
    };
  }, [contributions]);

  const handlePlayPause = useCallback(async () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.pause();
      setIsPlaying(false);
    } else {
      await engineRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleStop = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setIsPlaying(false);
    setProgress(0);
    setCurrentNote(null);
    setLayers({ drums: false, bass: false, chords: false, melody: false });
  }, []);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">@{username}의 심포니</h1>
        <p className="text-github-text-muted">
          {totalContributions.toLocaleString()}개의 기여가 음악이 되었습니다
        </p>
      </div>

      {/* 레이어 인디케이터 */}
      <div className="flex justify-center gap-3">
        <LayerIndicator label="🥁" name="Drums" active={layers.drums} />
        <LayerIndicator label="🎸" name="Bass" active={layers.bass} />
        <LayerIndicator label="🎹" name="Chords" active={layers.chords} />
        <LayerIndicator label="🎵" name="Melody" active={layers.melody} />
      </div>

      {/* 시각화 */}
      <ContributionVisualizer
        contributions={contributions}
        currentWeekIndex={currentNote?.weekIndex ?? -1}
        currentDayIndex={currentNote?.dayIndex ?? -1}
        isPlaying={isPlaying}
      />

      {/* 진행률 */}
      <ProgressBar
        progress={progress}
        currentWeek={currentNote?.weekIndex ?? 0}
        totalWeeks={contributions.length}
      />

      {/* 재생 컨트롤 */}
      <div className="flex justify-center">
        <PlaybackControls
          isPlaying={isPlaying}
          isReady={isReady}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
        />
      </div>

      {/* 현재 재생 정보 */}
      {currentNote && (
        <div className="text-center text-sm text-github-text-muted">
          <span className="font-medium">{currentNote.date}</span>
          <span className="mx-2">•</span>
          <span>{currentNote.chordName}</span>
          <span className="mx-2">•</span>
          <span className={currentNote.contributionCount > 0 ? "text-github-green-4" : ""}>
            {currentNote.contributionCount} commits
          </span>
        </div>
      )}

      {/* 통계 */}
      <PlayerStats
        totalContributions={totalContributions}
        totalNotes={totalNotes}
        averageTempo={averageTempo}
      />
    </div>
  );
}

// 레이어 인디케이터 컴포넌트
function LayerIndicator({
  label,
  name,
  active,
}: {
  label: string;
  name: string;
  active: boolean;
}) {
  return (
    <div
      className={`
        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
        ${
          active
            ? "bg-github-green-4 text-white scale-105"
            : "bg-github-canvas-subtle text-github-text-muted opacity-50"
        }
      `}
    >
      <span className="mr-1">{label}</span>
      <span className="hidden sm:inline">{name}</span>
    </div>
  );
}
