"use client";

import { MusicNote, convertContributionsToMusic } from "./mapper";
import { ContributionWeek } from "@/lib/github/types";
import { LOFI_CHORDS } from "./scales";

declare global {
  interface Window {
    Tone: any;
  }
}

export class MusicEngine {
  // 악기
  private strings: any = null;    // 스트링 패드 (배경)
  private piano: any = null;      // 피아노 (멜로디)
  private bass: any = null;       // 베이스

  // 이펙트
  private reverb: any = null;
  private delay: any = null;

  private isInitialized = false;
  private isPlaying = false;
  private notes: MusicNote[] = [];

  private layers = { drums: false, bass: false, chords: false, melody: false };

  public onNotePlay?: (note: MusicNote, index: number) => void;
  public onPlaybackEnd?: () => void;
  public onProgressUpdate?: (progress: number) => void;
  public onLayerChange?: (layers: typeof this.layers) => void;

  private async loadToneJS(): Promise<void> {
    if (typeof window !== "undefined" && window.Tone) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/tone@14.9.17/build/Tone.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Tone.js"));
      document.head.appendChild(script);
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.loadToneJS();
    const Tone = window.Tone;
    if (!Tone) throw new Error("Tone.js failed to load");

    await Tone.start();

    // 긴 리버브 (시네마틱 공간감)
    this.reverb = new Tone.Reverb({
      decay: 4,
      wet: 0.5,
    }).toDestination();
    await this.reverb.generate();

    // 딜레이 (깊이감)
    this.delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: 0.15,
    }).connect(this.reverb);

    // 스트링 패드 (항상 깔리는 배경)
    this.strings = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 1.5,
        decay: 0.5,
        sustain: 0.8,
        release: 3,
      },
    }).connect(this.reverb);
    this.strings.volume.value = -14;

    // 피아노 (멜로디)
    this.piano = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.02,
        decay: 0.4,
        sustain: 0.2,
        release: 1.5,
      },
    }).connect(this.delay);
    this.piano.volume.value = -8;

    // 베이스 (깊은 저음)
    this.bass = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.3,
        decay: 0.5,
        sustain: 0.6,
        release: 2,
      },
    }).connect(this.reverb);
    this.bass.volume.value = -12;

    this.isInitialized = true;
  }

  loadContributions(weeks: ContributionWeek[]): void {
    this.notes = convertContributionsToMusic(weeks);
  }

  async play(): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const Tone = window.Tone;
    const transport = Tone.getTransport();

    transport.cancel();
    transport.bpm.value = 60; // 느린 시네마틱 템포

    // 하루당 시간 간격
    const dayDuration = 0.4; // 초
    let lastChordIndex = -1;

    this.notes.forEach((note, noteIndex) => {
      const startTime = noteIndex * dayDuration;
      const weekIndex = note.weekIndex;
      const chordIndex = weekIndex % LOFI_CHORDS.length;
      const chord = LOFI_CHORDS[chordIndex];
      const count = note.contributionCount;

      transport.schedule((time: number) => {
        // 진행률 & 노트 정보
        this.onProgressUpdate?.(noteIndex / this.notes.length);
        this.onNotePlay?.(note, noteIndex);

        // 레이어 상태
        this.layers = {
          drums: false,
          bass: note.dayIndex === 0,
          chords: true, // 항상 배경음
          melody: count > 0,
        };
        this.onLayerChange?.({ ...this.layers });

        // === 1. 스트링 패드 (코드 바뀔 때마다) ===
        if (chordIndex !== lastChordIndex) {
          lastChordIndex = chordIndex;
          // 스트링은 부드럽게 코드 연주
          this.strings?.triggerAttackRelease(
            chord.notes,
            "2m", // 길게
            time,
            0.3
          );
        }

        // === 2. 베이스 (주 시작할 때) ===
        if (note.dayIndex === 0) {
          this.bass?.triggerAttackRelease(
            chord.bass,
            "1m",
            time,
            0.4
          );
        }

        // === 3. 피아노 멜로디 (기여도에 따라) ===
        if (count > 0) {
          // 기여도가 많을수록 더 많은 음
          const intensity = Math.min(count, 10) / 10; // 0-1
          const velocity = 0.3 + intensity * 0.4;

          if (count <= 3) {
            // 단음
            const noteToPlay = chord.arpeggio[note.dayIndex % chord.arpeggio.length];
            this.piano?.triggerAttackRelease(noteToPlay, "4n", time, velocity);
          } else if (count <= 7) {
            // 2음
            const notes = [
              chord.arpeggio[note.dayIndex % chord.arpeggio.length],
              chord.arpeggio[(note.dayIndex + 2) % chord.arpeggio.length],
            ];
            this.piano?.triggerAttackRelease(notes, "4n", time, velocity);
          } else {
            // 아르페지오 (고조)
            const arpNotes = chord.arpeggio.slice(0, Math.min(count - 5, 4));
            arpNotes.forEach((arpNote, i) => {
              this.piano?.triggerAttackRelease(
                arpNote,
                "8n",
                time + i * 0.12,
                velocity
              );
            });
          }
        }

        // 마지막 노트
        if (noteIndex === this.notes.length - 1) {
          transport.schedule(() => {
            this.stop();
            this.onPlaybackEnd?.();
          }, time + 3);
        }
      }, startTime);
    });

    transport.start();
  }

  pause(): void {
    if (!window.Tone) return;
    window.Tone.getTransport().pause();
    this.isPlaying = false;
  }

  resume(): void {
    if (!window.Tone) return;
    window.Tone.getTransport().start();
    this.isPlaying = true;
  }

  stop(): void {
    if (!window.Tone) return;
    window.Tone.getTransport().stop();
    window.Tone.getTransport().cancel();
    this.isPlaying = false;
    this.layers = { drums: false, bass: false, chords: false, melody: false };
    this.onProgressUpdate?.(0);
    this.onLayerChange?.({ ...this.layers });
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentNoteIndex(): number {
    return 0;
  }

  getTotalNotes(): number {
    return this.notes.length;
  }

  getNotes(): MusicNote[] {
    return this.notes;
  }

  getLayers(): typeof this.layers {
    return { ...this.layers };
  }

  dispose(): void {
    this.stop();
    this.strings?.dispose();
    this.piano?.dispose();
    this.bass?.dispose();
    this.reverb?.dispose();
    this.delay?.dispose();
    this.strings = null;
    this.piano = null;
    this.bass = null;
    this.reverb = null;
    this.delay = null;
    this.isInitialized = false;
  }
}
