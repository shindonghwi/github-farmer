"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function UsernameSearchForm() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    router.push(`/${username.trim()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub 유저네임 입력..."
          className="flex-1 px-4 py-3 bg-github-bg-secondary border border-github-border rounded-lg
                     text-github-text placeholder-github-text-muted
                     focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent
                     transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!username.trim() || isLoading}
          className="px-6 py-3 bg-github-green-4 text-github-bg font-semibold rounded-lg
                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity"
        >
          {isLoading ? (
            <span className="inline-block animate-spin">↻</span>
          ) : (
            "▶ 재생"
          )}
        </button>
      </div>
    </form>
  );
}
