// 코드별 색상 팔레트 (기여도 레벨 0-4)
export const CHORD_COLORS: Record<string, Record<number, string>> = {
  Cmaj7: {
    0: "#161b22",
    1: "#0c3d5f",
    2: "#1268a3",
    3: "#2196f3",
    4: "#64b5f6",
  },
  Am7: {
    0: "#161b22",
    1: "#3d1f5c",
    2: "#6a1b9a",
    3: "#9c27b0",
    4: "#ce93d8",
  },
  Fmaj7: {
    0: "#161b22",
    1: "#1b4332",
    2: "#2d6a4f",
    3: "#40916c",
    4: "#74c69d",
  },
  G7: {
    0: "#161b22",
    1: "#5c3d1f",
    2: "#a36212",
    3: "#f39c12",
    4: "#f9ca24",
  },
};

// 기본 색상 (코드 정보 없을 때)
export const CONTRIBUTION_COLORS: Record<number, string> = {
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

// 색상 레벨 계산
export function getColorLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 12) return 3;
  return 4;
}

// 코드 이름으로 색상 가져오기
export function getColorForChord(chordName: string, count: number): string {
  const level = getColorLevel(count);
  const palette = CHORD_COLORS[chordName] || CONTRIBUTION_COLORS;
  return palette[level];
}

// 주 인덱스로 코드 이름 가져오기
const CHORD_NAMES = ["Cmaj7", "Am7", "Fmaj7", "G7"];
export function getChordNameForWeek(weekIndex: number): string {
  return CHORD_NAMES[weekIndex % CHORD_NAMES.length];
}

// 하이라이트 색상
export const HIGHLIGHT_COLORS = {
  current: "#ffffff",
  glow: "#ffffff",
  indicator: "#58a6ff",
};

// 배경 색상
export const BG_COLOR = "#0d1117";
