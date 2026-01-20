export const CONTRIBUTION_QUERY = `
  query GetUserContributions($username: String!) {
    user(login: $username) {
      name
      login
      avatarUrl
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          contributions(first: 100) {
            nodes {
              occurredAt
              commitCount
            }
          }
        }
        pullRequestContributions(first: 100) {
          nodes {
            occurredAt
          }
        }
        issueContributions(first: 100) {
          nodes {
            occurredAt
          }
        }
        pullRequestReviewContributions(first: 100) {
          nodes {
            occurredAt
          }
        }
      }
    }
  }
`;
