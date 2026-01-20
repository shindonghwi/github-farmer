"use client";

import { useRef, useEffect, useCallback } from "react";
import { ContributionWeek } from "@/lib/github/types";
import {
  getColorForChord,
  getChordNameForWeek,
  BG_COLOR,
  HIGHLIGHT_COLORS,
} from "@/lib/canvas/colors";

interface Props {
  contributions: ContributionWeek[];
  currentWeekIndex: number;
  currentDayIndex: number;
  isPlaying: boolean;
}

const CELL_SIZE = 12;
const CELL_GAP = 3;
const PADDING = 16;

export function ContributionVisualizer({
  contributions,
  currentWeekIndex,
  currentDayIndex,
  isPlaying,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 클리어
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 기여도 그리드 그리기
    contributions.forEach((week, weekIndex) => {
      week.contributionDays.forEach((day, dayIndex) => {
        const x = PADDING + weekIndex * (CELL_SIZE + CELL_GAP);
        const y = PADDING + dayIndex * (CELL_SIZE + CELL_GAP);

        // 주별 코드에 따른 색상 적용
        const chordName = getChordNameForWeek(weekIndex);
        ctx.fillStyle = getColorForChord(chordName, day.contributionCount);

        // 현재 재생 위치 하이라이트
        if (
          weekIndex === currentWeekIndex &&
          dayIndex === currentDayIndex &&
          isPlaying
        ) {
          ctx.shadowColor = HIGHLIGHT_COLORS.glow;
          ctx.shadowBlur = 12;
          ctx.fillStyle = HIGHLIGHT_COLORS.current;
        } else {
          ctx.shadowBlur = 0;
        }

        // 둥근 모서리 사각형
        ctx.beginPath();
        ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, 2);
        ctx.fill();
      });
    });

    // 현재 주 인디케이터 (재생 중일 때)
    if (isPlaying && currentWeekIndex >= 0) {
      const indicatorX =
        PADDING + currentWeekIndex * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
      ctx.strokeStyle = HIGHLIGHT_COLORS.indicator;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(indicatorX, 0);
      ctx.lineTo(indicatorX, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 재생 중일 때 애니메이션 루프
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [contributions, currentWeekIndex, currentDayIndex, isPlaying]);

  useEffect(() => {
    draw();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // 캔버스 크기 계산
  const canvasWidth = PADDING * 2 + contributions.length * (CELL_SIZE + CELL_GAP);
  const canvasHeight = PADDING * 2 + 7 * (CELL_SIZE + CELL_GAP);

  return (
    <div className="overflow-x-auto">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="rounded-lg border border-github-border"
        style={{ minWidth: canvasWidth }}
      />
    </div>
  );
}
