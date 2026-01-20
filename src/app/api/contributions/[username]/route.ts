import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubGraphQL } from "@/lib/github/client";
import { CONTRIBUTION_QUERY } from "@/lib/github/queries";
import { ContributionResponse, ContributionDay } from "@/lib/github/types";

// 날짜를 YYYY-MM-DD 형식으로 변환
function toDateString(isoString: string): string {
  return isoString.split("T")[0];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username || username.length > 39) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  try {
    const data = await fetchGitHubGraphQL<ContributionResponse>(
      CONTRIBUTION_QUERY,
      { username }
    );

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { contributionsCollection } = data.user;

    // 날짜별 breakdown 계산
    const dateBreakdown: Record<string, { commits: number; prs: number; issues: number; reviews: number }> = {};

    // 커밋 (레포별로 되어있어서 합산)
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

    // 응답 구성
    const response = {
      name: data.user.name,
      login: data.user.login,
      avatarUrl: data.user.avatarUrl,
      stats: {
        totalContributions: contributionsCollection.contributionCalendar.totalContributions,
        totalCommits: contributionsCollection.totalCommitContributions,
        totalPullRequests: contributionsCollection.totalPullRequestContributions,
        totalIssues: contributionsCollection.totalIssueContributions,
        totalReviews: contributionsCollection.totalPullRequestReviewContributions,
      },
      weeks: enrichedWeeks,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}
