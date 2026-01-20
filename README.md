# GitHub Contribution Collector

GitHub 기여도를 게임처럼 수집하는 시각화 웹앱.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- GitHub 기여도 그래프 시각화
- 화살표가 잔디를 수집하며 이동
- 1000 기여도마다 달걀이 부화하여 병아리 등장
- Commits, PRs, Issues, Reviews 세부 통계 표시

## Demo

`https://your-project.vercel.app/shindonghwi`

## Getting Started

### 1. 환경변수 설정

`.env.local` 파일 생성:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

GitHub Token은 [Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)에서 생성.
필요한 권한: `read:user`

### 2. 설치 및 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

### 3. 사용법

`http://localhost:3000/{github_username}` 접속

예: `http://localhost:3000/shindonghwi`

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/github-contribution-collector)

1. Vercel에서 GitHub 레포 import
2. Environment Variables에 `GITHUB_TOKEN` 추가
3. Deploy!

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Canvas API
- **API**: GitHub GraphQL API

## License

MIT
