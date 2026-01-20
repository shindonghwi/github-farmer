import { LOFI_CHORDS, getChordForWeek, getArpeggioPattern, getSwingOffset } from "./scales";
import { ContributionDay } from "@/lib/github/types";

export interface MusicNote {
  // 메인 멜로디 (아르페지오)
  arpeggioNotes: string[];
  // 코드 (패드 사운드용)
  chordNotes: string[];
  // 베이스
  bassNote: string;
  // 타이밍
  duration: string;
  velocity: number;
  swingOffset: number;
  // 메타데이터
  weekIndex: number;
  dayIndex: number;
  date: string;
  contributionCount: number;
  chordName: string;
  // 레거시 호환
  pitch: string | null;
}

// 기여 횟수 → 벨로시티 (lo-fi는 부드럽게)
export function mapContributionToVelocity(count: number): number {
  if (count === 0) return 0;
  // Lo-fi는 전체적으로 부드러운 다이나믹
  return Math.min(0.3 + count * 0.03, 0.6);
}

// 기여 횟수 → 음길이 (lo-fi는 느긋하게)
export function mapContributionToDuration(count: number): string {
  if (count === 0) return "8n";
  if (count <= 3) return "4n";
  if (count <= 7) return "2n";
  return "2n."; // 점 2분음표 (더 길게)
}

// 주간 총 기여 → 템포 (lo-fi는 느리게 70-85 BPM)
export function calculateTempo(weeklyTotal: number): number {
  // Lo-fi는 항상 느린 템포 유지
  if (weeklyTotal <= 10) return 70;
  if (weeklyTotal <= 30) return 75;
  return 85; // 최대 85 BPM
}

// 전체 기여도 데이터 → Lo-fi 음악 노트 배열 변환
export function convertContributionsToMusic(
  weeks: { contributionDays: ContributionDay[] }[]
): MusicNote[] {
  const notes: MusicNote[] = [];
  let globalNoteIndex = 0;

  weeks.forEach((week, weekIndex) => {
    // 주마다 코드 변경 (4코드 순환)
    const chord = getChordForWeek(weekIndex);

    week.contributionDays.forEach((day, dayIndex) => {
      const arpeggioNotes = getArpeggioPattern(day.contributionCount, chord);

      const note: MusicNote = {
        arpeggioNotes,
        chordNotes: day.contributionCount > 0 ? chord.notes : [],
        bassNote: chord.bass,
        duration: mapContributionToDuration(day.contributionCount),
        velocity: mapContributionToVelocity(day.contributionCount),
        swingOffset: getSwingOffset(globalNoteIndex),
        weekIndex,
        dayIndex,
        date: day.date,
        contributionCount: day.contributionCount,
        chordName: chord.name,
        // 레거시 호환
        pitch: arpeggioNotes.length > 0 ? arpeggioNotes[0] : null,
      };

      notes.push(note);
      globalNoteIndex++;
    });
  });

  return notes;
}

// 주별 템포 계산
export function calculateWeeklyTempos(
  weeks: { contributionDays: ContributionDay[] }[]
): number[] {
  return weeks.map((week) => {
    const weeklyTotal = week.contributionDays.reduce(
      (sum, day) => sum + day.contributionCount,
      0
    );
    return calculateTempo(weeklyTotal);
  });
}

// 레거시 함수들 (호환성)
export function mapContributionToNote(count: number): string | null {
  if (count === 0) return null;
  const chord = LOFI_CHORDS[0];
  const pattern = getArpeggioPattern(count, chord);
  return pattern.length > 0 ? pattern[0] : null;
}
