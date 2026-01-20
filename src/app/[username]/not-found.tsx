import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="text-6xl">🔇</div>
        <h2 className="text-2xl font-semibold">사용자를 찾을 수 없습니다</h2>
        <p className="text-github-text-muted">
          GitHub 유저네임을 다시 확인해주세요
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-github-green-4 text-github-bg font-semibold rounded-lg
                     hover:opacity-90 transition-opacity"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
