export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
  // 세부 breakdown (클라이언트에서 계산)
  commits?: number;
  pullRequests?: number;
  issues?: number;
  reviews?: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface CommitContribution {
  occurredAt: string;
  commitCount: number;
}

export interface DateContribution {
  occurredAt: string;
}

export interface ContributionsCollection {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  contributionCalendar: ContributionCalendar;
  commitContributionsByRepository: {
    contributions: {
      nodes: CommitContribution[];
    };
  }[];
  pullRequestContributions: {
    nodes: DateContribution[];
  };
  issueContributions: {
    nodes: DateContribution[];
  };
  pullRequestReviewContributions: {
    nodes: DateContribution[];
  };
}

export interface GitHubUser {
  name: string | null;
  login: string;
  avatarUrl: string;
  contributionsCollection: ContributionsCollection;
}

export interface ContributionResponse {
  user: GitHubUser | null;
}

// 총합 통계
export interface ContributionStats {
  totalContributions: number;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalReviews: number;
}
