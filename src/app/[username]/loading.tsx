export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="text-6xl animate-pulse">🎵</div>
        <h2 className="text-2xl font-semibold">당신의 코드를 연주 중...</h2>
        <p className="text-github-text-muted">
          GitHub 기여도를 분석하고 있습니다
        </p>
        <div className="flex justify-center gap-1">
          <div
            className="w-2 h-8 bg-github-green-1 rounded animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-12 bg-github-green-2 rounded animate-pulse"
            style={{ animationDelay: "100ms" }}
          />
          <div
            className="w-2 h-16 bg-github-green-3 rounded animate-pulse"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-2 h-10 bg-github-green-4 rounded animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
          <div
            className="w-2 h-14 bg-github-green-3 rounded animate-pulse"
            style={{ animationDelay: "400ms" }}
          />
          <div
            className="w-2 h-8 bg-github-green-2 rounded animate-pulse"
            style={{ animationDelay: "500ms" }}
          />
        </div>
      </div>
    </main>
  );
}
