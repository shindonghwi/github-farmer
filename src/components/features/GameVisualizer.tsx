"use client";

import { useRef, useEffect, useCallback } from "react";
import { ContributionWeek, ContributionStats } from "@/lib/github/types";
import {
  CONTRIBUTION_COLORS,
  getColorLevel,
} from "@/lib/canvas/colors";

interface Props {
  contributions: ContributionWeek[];
  stats: ContributionStats;
  isPlaying: boolean;
  onComplete?: () => void;
}

const CELL_SIZE = 14;
const CELL_GAP = 4;
const PADDING = 24;
const MOVE_INTERVAL = 40;

export function GameVisualizer({
  contributions,
  stats,
  isPlaying,
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastMoveRef = useRef(0);

  // 첫번째 주의 시작 일 인덱스 계산
  const firstWeekStartDay = contributions[0]?.contributionDays.length < 7
    ? 7 - contributions[0].contributionDays.length
    : 0;

  const stateRef = useRef({
    week: 0,
    day: 0,
    direction: "down" as "down" | "up",
    isTurning: false,
    visitedCells: new Set<string>(),
    collectedCount: 0,
    displayedCount: 0,
    isComplete: false,
    // 세부 카운트
    commits: 0,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
    // 병아리 부화 시스템
    chickBornTime: 0,
    hatchedChicks: 0,
  });

  // 게임 시작 시 상태 리셋
  const prevIsPlayingRef = useRef(false);
  useEffect(() => {
    if (isPlaying && !prevIsPlayingRef.current) {
      // 게임 시작: 상태 초기화
      stateRef.current = {
        week: 0,
        day: 0,
        direction: "down",
        isTurning: false,
        visitedCells: new Set<string>(),
        collectedCount: 0,
        displayedCount: 0,
        isComplete: false,
        commits: 0,
        pullRequests: 0,
        issues: 0,
        reviews: 0,
        chickBornTime: 0,
        hatchedChicks: 0,
      };
      lastMoveRef.current = performance.now();
    }
    prevIsPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 총 Contribution 수 (실제 커밋 합계)
  const totalContributions = contributions.reduce(
    (sum, week) =>
      sum + week.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
    0
  );

  const gridToPixel = (week: number, day: number) => {
    // 첫번째 주는 오프셋 적용
    const weekDays = contributions[week]?.contributionDays.length || 7;
    const yOffset = weekDays < 7 ? (7 - weekDays) : 0;

    return {
      x: PADDING + week * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
      y: PADDING + (day + yOffset) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
    };
  };

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;

    // 배경
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 기여도 그리드 (동그랗게)
    contributions.forEach((week, weekIndex) => {
      week.contributionDays.forEach((day, dayIndex) => {
        const pos = gridToPixel(weekIndex, dayIndex);
        const cellKey = `${weekIndex}-${dayIndex}`;
        const isCollected = state.visitedCells.has(cellKey);

        if (isCollected) {
          ctx.fillStyle = "#30363d";
          ctx.globalAlpha = 0.7;
        } else {
          const level = getColorLevel(day.contributionCount);
          ctx.fillStyle = CONTRIBUTION_COLORS[level];
          ctx.globalAlpha = 1;
        }

        // 동그란 셀
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, CELL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    });

    // 캐릭터 (화살표)
    const charPos = gridToPixel(state.week, state.day);

    ctx.save();
    ctx.translate(charPos.x, charPos.y);

    let rotation = 0;
    if (state.direction === "down") rotation = Math.PI;
    else if (state.direction === "up") rotation = 0;
    if (state.isTurning) rotation = Math.PI / 2;

    ctx.rotate(rotation);

    ctx.shadowColor = "#00fff5";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#00fff5";
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(6, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 표시 카운트: 항상 일정 속도로 증가 (collectedCount가 한도)
    // 게임 완료 후에도 애니메이션 계속
    if (state.displayedCount < state.collectedCount) {
      const speed = isPlaying ? 4 : 8; // 화살표 속도에 맞춤
      state.displayedCount += speed;
      if (state.displayedCount > state.collectedCount) {
        state.displayedCount = state.collectedCount;
      }
    }

    // 달걀 진행도 (0-1000 사이클)
    const currentProgress = Math.floor(state.displayedCount) % 1000;
    const currentThousand = Math.floor(state.displayedCount / 1000);
    const crackLevel = currentProgress / 1000; // 0~1 (금 정도)

    // 병아리 부화 체크
    if (currentThousand > state.hatchedChicks) {
      state.hatchedChicks = currentThousand;
      state.chickBornTime = timestamp;
    }

    // 부화 직후인지 (0.8초간 병아리 강조)
    const justHatched = timestamp - state.chickBornTime < 800;

    // 하단 영역 (그리드 아래)
    const gridEndY = PADDING + 7 * (CELL_SIZE + CELL_GAP);

    // 첫 줄: 총 Contribution (왼쪽)
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.font = "bold 16px monospace";
    ctx.fillStyle = "#39d353";
    ctx.fillText(`Contributions: ${Math.floor(state.displayedCount)}`, PADDING, gridEndY + 20);

    // 둘째 줄: 세부 통계
    ctx.font = "11px monospace";
    const statsY = gridEndY + 38;

    // Commits
    ctx.fillStyle = "#666";
    ctx.fillText("Commits:", PADDING, statsY);
    ctx.fillStyle = "#39d353";
    ctx.fillText(`${state.commits}`, PADDING + 55, statsY);

    // PRs
    ctx.fillStyle = "#666";
    ctx.fillText("PRs:", PADDING + 90, statsY);
    ctx.fillStyle = "#a371f7";
    ctx.fillText(`${state.pullRequests}`, PADDING + 118, statsY);

    // Issues
    ctx.fillStyle = "#666";
    ctx.fillText("Issues:", PADDING + 150, statsY);
    ctx.fillStyle = "#f9ca24";
    ctx.fillText(`${state.issues}`, PADDING + 195, statsY);

    // Reviews
    ctx.fillStyle = "#666";
    ctx.fillText("Reviews:", PADDING + 230, statsY);
    ctx.fillStyle = "#58a6ff";
    ctx.fillText(`${state.reviews}`, PADDING + 285, statsY);

    ctx.restore();

    // 셋째 줄: 병아리들 + 달걀 (왼쪽 하단)
    const rowY = gridEndY + 75;
    const spacing = 40;
    const startX = PADDING + 20;

    // 부화한 병아리들 (왼쪽부터)
    for (let i = 0; i < state.hatchedChicks; i++) {
      const chickX = startX + i * spacing;

      ctx.save();
      ctx.translate(chickX, rowY);

      // 병아리 몸통
      ctx.shadowColor = "#f9ca24";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#f9ca24";
      ctx.beginPath();
      ctx.ellipse(0, 5, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 머리
      ctx.beginPath();
      ctx.arc(0, -7, 9, 0, Math.PI * 2);
      ctx.fill();

      // 부리
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ff6b00";
      ctx.beginPath();
      ctx.moveTo(9, -7);
      ctx.lineTo(15, -6);
      ctx.lineTo(9, -4);
      ctx.closePath();
      ctx.fill();

      // 눈
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(4, -8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 눈 하이라이트
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(5, -9, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 현재 달걀 (병아리들 오른쪽, 같은 간격)
    const eggX = startX + state.hatchedChicks * spacing;

    ctx.save();
    ctx.translate(eggX, rowY);

    // 거의 부화 (90%~) - 흔들림
    if (crackLevel > 0.9) {
      const shake = Math.sin(timestamp * 0.05) * 2;
      ctx.translate(shake, 0);
    }

    // 달걀 본체
    ctx.shadowColor = "#f5f5dc";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#f5f5dc";
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 달걀 하이라이트
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(-5, -7, 3, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 금 그리기 (crackLevel에 따라)
    if (crackLevel > 0.1) {
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(-2, -12);
      ctx.lineTo(0, -5);
      ctx.lineTo(5, -8);
      ctx.stroke();

      if (crackLevel > 0.3) {
        ctx.beginPath();
        ctx.moveTo(7, -5);
        ctx.lineTo(4, 3);
        ctx.lineTo(9, 8);
        ctx.stroke();
      }

      if (crackLevel > 0.5) {
        ctx.beginPath();
        ctx.moveTo(-7, -3);
        ctx.lineTo(-4, 5);
        ctx.lineTo(-8, 12);
        ctx.stroke();
      }

      if (crackLevel > 0.7) {
        ctx.strokeStyle = "#6b5344";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-6, 5);
        ctx.lineTo(-11, 12);
        ctx.stroke();

        // 노른자
        ctx.fillStyle = "#f9ca24";
        ctx.globalAlpha = (crackLevel - 0.7) * 2;
        ctx.beginPath();
        ctx.arc(0, 4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();

    // 진행률 바 (달걀 아래)
    const barWidth = 50;
    const barX = eggX - barWidth / 2;
    const barY = rowY + 28;

    ctx.fillStyle = "#333";
    ctx.fillRect(barX, barY, barWidth, 4);
    ctx.fillStyle = crackLevel > 0.7 ? "#f9ca24" : "#39d353";
    ctx.fillRect(barX, barY, barWidth * crackLevel, 4);

    // 게임 로직
    if (isPlaying && !state.isComplete) {
      const elapsed = timestamp - lastMoveRef.current;

      if (elapsed >= MOVE_INTERVAL) {
        lastMoveRef.current = timestamp;

        const cellKey = `${state.week}-${state.day}`;

        // Contribution 수집 (실제 기여 횟수 추가)
        if (!state.visitedCells.has(cellKey)) {
          const week = contributions[state.week];
          if (week) {
            const day = week.contributionDays[state.day];
            if (day && day.contributionCount > 0) {
              state.collectedCount += day.contributionCount;
              // 세부 카운트 추가
              state.commits += day.commits || 0;
              state.pullRequests += day.pullRequests || 0;
              state.issues += day.issues || 0;
              state.reviews += day.reviews || 0;
            }
          }
          state.visitedCells.add(cellKey);
        }

        if (state.isTurning) {
          state.isTurning = false;
          state.week++;

          if (state.week >= contributions.length) {
            state.isComplete = true;
            onComplete?.();
          } else {
            // 새 주의 시작 위치 설정
            const newWeekDays = contributions[state.week].contributionDays.length;
            if (state.direction === "down") {
              state.day = 0;
            } else {
              state.day = newWeekDays - 1;
            }
          }
        } else {
          const currentWeekDays = contributions[state.week]?.contributionDays.length || 7;

          if (state.direction === "down") {
            if (state.day < currentWeekDays - 1) {
              state.day++;
            } else {
              state.direction = "up";
              state.isTurning = true;
            }
          } else {
            if (state.day > 0) {
              state.day--;
            } else {
              state.direction = "down";
              state.isTurning = true;
            }
          }
        }
      }
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [contributions, isPlaying, totalContributions, onComplete]);

  useEffect(() => {
    lastMoveRef.current = performance.now();
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  const canvasWidth = PADDING * 2 + contributions.length * (CELL_SIZE + CELL_GAP);
  const canvasHeight = PADDING * 2 + 7 * (CELL_SIZE + CELL_GAP) + 150;

  return (
    <div className="overflow-x-auto">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="rounded-md"
        style={{ minWidth: canvasWidth }}
      />
    </div>
  );
}
