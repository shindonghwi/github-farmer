// Lo-fi Hip Hop 코드 진행 (재즈 보이싱)
// Cmaj7 - Am7 - Fmaj7 - G7 (클래식한 lo-fi 진행)
export const LOFI_CHORDS = [
  {
    name: "Cmaj7",
    notes: ["C3", "E3", "G3", "B3"],
    bass: "C2",
    arpeggio: ["C4", "E4", "G4", "B4", "C5"],
  },
  {
    name: "Am7",
    notes: ["A2", "C3", "E3", "G3"],
    bass: "A1",
    arpeggio: ["A3", "C4", "E4", "G4", "A4"],
  },
  {
    name: "Fmaj7",
    notes: ["F2", "A2", "C3", "E3"],
    bass: "F1",
    arpeggio: ["F3", "A3", "C4", "E4", "F4"],
  },
  {
    name: "G7",
    notes: ["G2", "B2", "D3", "F3"],
    bass: "G1",
    arpeggio: ["G3", "B3", "D4", "F4", "G4"],
  },
];

// 대체 진행 (더 멜랑콜리)
export const LOFI_CHORDS_ALT = [
  {
    name: "Dm7",
    notes: ["D3", "F3", "A3", "C4"],
    bass: "D2",
    arpeggio: ["D4", "F4", "A4", "C5", "D5"],
  },
  {
    name: "G7",
    notes: ["G2", "B2", "D3", "F3"],
    bass: "G1",
    arpeggio: ["G3", "B3", "D4", "F4", "G4"],
  },
  {
    name: "Cmaj7",
    notes: ["C3", "E3", "G3", "B3"],
    bass: "C2",
    arpeggio: ["C4", "E4", "G4", "B4", "C5"],
  },
  {
    name: "Am7",
    notes: ["A2", "C3", "E3", "G3"],
    bass: "A1",
    arpeggio: ["A3", "C4", "E4", "G4", "A4"],
  },
];

// 현재 주 인덱스에서 코드 가져오기
export function getChordForWeek(weekIndex: number) {
  return LOFI_CHORDS[weekIndex % LOFI_CHORDS.length];
}

// 기여도에 따른 아르페지오 패턴 선택
export function getArpeggioPattern(contributionCount: number, chord: typeof LOFI_CHORDS[0]): string[] {
  if (contributionCount === 0) return []; // 쉼표
  if (contributionCount <= 2) return [chord.arpeggio[0]]; // 루트만
  if (contributionCount <= 5) return [chord.arpeggio[0], chord.arpeggio[2]]; // 루트 + 5th
  if (contributionCount <= 10) return [chord.arpeggio[0], chord.arpeggio[1], chord.arpeggio[2]]; // 1-3-5
  return chord.arpeggio.slice(0, 4); // 풀 아르페지오
}

// 스윙 타이밍 (lo-fi 그루브)
export function getSwingOffset(noteIndex: number): number {
  // 홀수 노트는 살짝 늦게 (스윙 느낌)
  return noteIndex % 2 === 1 ? 0.03 : 0;
}

// 레거시 호환성
export const PENTATONIC_SCALE = [
  "C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5",
];

export const BASS_NOTES: (string | null)[] = [
  "C2", "C2", "D2", "E2", "G2", "A2", null,
];

export function getBassNote(weekday: number): string | null {
  if (weekday === 0 || weekday === 6) return null;
  return BASS_NOTES[weekday];
}

export const CHORD_PROGRESSIONS = {
  streak7: [
    ["C4", "E4", "G4"],
    ["G3", "B3", "D4"],
    ["A3", "C4", "E4"],
    ["F3", "A3", "C4"],
  ],
};
