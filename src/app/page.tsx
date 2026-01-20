import { UsernameSearchForm } from "@/components/features/UsernameSearchForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-12 text-center">
        {/* 로고 & 타이틀 */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">
            <span className="text-github-green-4">🌱</span> GitHub Farmer{" "}
            <span className="text-github-green-4">🐣</span>
          </h1>
          <p className="text-xl text-github-text-muted">
            잔디를 수확하고 병아리를 키우세요
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="flex justify-center">
          <UsernameSearchForm />
        </div>

        {/* 설명 */}
        <div className="text-github-text-muted space-y-2">
          <p>GitHub 유저네임을 입력하면 잔디밭 수확 게임이 시작됩니다</p>
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
            <div className="text-2xl mb-2">🌱</div>
            <h3 className="font-semibold mb-1">잔디 수확</h3>
            <p className="text-sm text-github-text-muted">
              화살표가 잔디밭을 누비며 기여도를 수집합니다
            </p>
          </div>
          <div className="p-4 bg-github-bg-secondary rounded-lg border border-github-border">
            <div className="text-2xl mb-2">🥚</div>
            <h3 className="font-semibold mb-1">달걀 부화</h3>
            <p className="text-sm text-github-text-muted">
              1000 기여도마다 달걀이 부화하여 병아리가 태어납니다
            </p>
          </div>
          <div className="p-4 bg-github-bg-secondary rounded-lg border border-github-border">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">세부 통계</h3>
            <p className="text-sm text-github-text-muted">
              Commits, PRs, Issues, Reviews 통계를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="absolute bottom-4 text-sm text-github-text-muted">
        <a
          href="https://github.com/shindonghwi/github-farmer"
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
