import { notFound } from "next/navigation";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { fetchGitHubGraphQL } from "@/lib/github/client";
import { CONTRIBUTION_QUERY } from "@/lib/github/queries";
import { ContributionResponse, ContributionDay, ContributionStats } from "@/lib/github/types";

const GamePlayer = dynamic(
  () => import("@/components/features/GamePlayer").then((mod) => mod.GamePlayer),
  { ssr: false }
);

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username}의 잔디밭 | GitHub Farmer`,
    description: `${username}의 GitHub 잔디를 수확하고 병아리를 키우세요!`,
  };
}

function toDateString(isoString: string): string {
  return isoString.split("T")[0];
}

async function getContributions(username: string) {
  try {
    const data = await fetchGitHubGraphQL<ContributionResponse>(
      CONTRIBUTION_QUERY,
      { username }
    );

    if (!data.user) return null;

    const { contributionsCollection } = data.user;

    // 날짜별 breakdown 계산
    const dateBreakdown: Record<string, { commits: number; prs: number; issues: number; reviews: number }> = {};

    // 커밋
    contributionsCollection.commitContributionsByRepository?.forEach((repo) => {
      repo.contributions.nodes.forEach((c) => {
        const date = toDateString(c.occurredAt);
        if (!dateBreakdown[date]) {
          dateBreakdown[date] = { commits: 0, prs: 0, issues: 0, reviews: 0 };
        }
        dateBreakdown[date].commits += c.commitCount;
      });
    });

    // PR
    contributionsCollection.pullRequestContributions?.nodes.forEach((c) => {
      const date = toDateString(c.occurredAt);
      if (!dateBreakdown[date]) {
        dateBreakdown[date] = { commits: 0, prs: 0, issues: 0, reviews: 0 };
      }
      dateBreakdown[date].prs += 1;
    });

    // Issue
    contributionsCollection.issueContributions?.nodes.forEach((c) => {
      const date = toDateString(c.occurredAt);
      if (!dateBreakdown[date]) {
        dateBreakdown[date] = { commits: 0, prs: 0, issues: 0, reviews: 0 };
      }
      dateBreakdown[date].issues += 1;
    });

    // Review
    contributionsCollection.pullRequestReviewContributions?.nodes.forEach((c) => {
      const date = toDateString(c.occurredAt);
      if (!dateBreakdown[date]) {
        dateBreakdown[date] = { commits: 0, prs: 0, issues: 0, reviews: 0 };
      }
      dateBreakdown[date].reviews += 1;
    });

    // weeks에 breakdown 추가
    const enrichedWeeks = contributionsCollection.contributionCalendar.weeks.map((week) => ({
      contributionDays: week.contributionDays.map((day): ContributionDay => {
        const breakdown = dateBreakdown[day.date];
        return {
          ...day,
          commits: breakdown?.commits || 0,
          pullRequests: breakdown?.prs || 0,
          issues: breakdown?.issues || 0,
          reviews: breakdown?.reviews || 0,
        };
      }),
    }));

    const stats: ContributionStats = {
      totalContributions: contributionsCollection.contributionCalendar.totalContributions,
      totalCommits: contributionsCollection.totalCommitContributions,
      totalPullRequests: contributionsCollection.totalPullRequestContributions,
      totalIssues: contributionsCollection.totalIssueContributions,
      totalReviews: contributionsCollection.totalPullRequestReviewContributions,
    };

    return {
      login: data.user.login,
      weeks: enrichedWeeks,
      stats,
    };
  } catch (error) {
    console.error("Failed to fetch contributions:", error);
    return null;
  }
}

// 시스템 파일 요청 필터
const EXCLUDED_PATHS = ["favicon.ico", "robots.txt", "sitemap.xml", "_next", "api"];

export default async function UserPage({ params }: Props) {
  const { username } = await params;

  // 시스템 경로는 404 처리
  if (EXCLUDED_PATHS.some((path) => username.includes(path))) {
    notFound();
  }

  const data = await getContributions(username);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <GamePlayer
        username={data.login}
        contributions={data.weeks}
        stats={data.stats}
      />
    </main>
  );
}
