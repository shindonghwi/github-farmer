import { UsernameSearchForm } from "@/components/features/UsernameSearchForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-12 text-center">
        {/* 로고 & 타이틀 */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">
            <span className="text-github-green-4">♪</span> Code Symphony
          </h1>
          <p className="text-xl text-github-text-muted">
            당신의 코딩 여정을 들어보세요
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="flex justify-center">
          <UsernameSearchForm />
        </div>

        {/* 설명 */}
        <div className="text-github-text-muted space-y-2">
          <p>GitHub 유저네임을 입력하면 기여도 데이터가 음악으로 변환됩니다</p>
          <p className="text-sm">
            예시:{" "}
            <a
              href="/torvalds"
              className="text-github-accent hover:underline"
            >
              torvalds
            </a>
            ,{" "}
            <a
              href="/sindresorhus"
              className="text-github-accent hover:underline"
            >
              sindresorhus
            </a>
            ,{" "}
            <a
              href="/shindonghwi"
              className="text-github-accent hover:underline"
            >
              shindonghwi
            </a>
          </p>
        </div>

        {/* 기능 설명 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-github-bg-secondary rounded-lg border border-github-border">
            <div className="text-2xl mb-2">🎵</div>
            <h3 className="font-semibold mb-1">기여도 → 음악</h3>
            <p className="text-sm text-github-text-muted">
              커밋 수가 멜로디가 되고, 활동량이 템포가 됩니다
            </p>
          </div>
          <div className="p-4 bg-github-bg-secondary rounded-lg border border-github-border">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">실시간 시각화</h3>
            <p className="text-sm text-github-text-muted">
              음악에 맞춰 기여도 그래프가 하이라이트됩니다
            </p>
          </div>
          <div className="p-4 bg-github-bg-secondary rounded-lg border border-github-border">
            <div className="text-2xl mb-2">🎹</div>
            <h3 className="font-semibold mb-1">C Major Pentatonic</h3>
            <p className="text-sm text-github-text-muted">
              불협화음 없는 편안한 멜로디를 생성합니다
            </p>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="absolute bottom-4 text-sm text-github-text-muted">
        <a
          href="https://github.com/shindonghwi/github-symphony-graph"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-github-accent transition-colors"
        >
          GitHub에서 보기 ↗
        </a>
      </footer>
    </main>
  );
}
