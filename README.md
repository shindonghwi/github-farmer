# GitHub Farmer

GitHub 잔디를 수확하고 병아리를 키우는 게임형 시각화 웹앱.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- GitHub 잔디(기여도) 그래프 시각화
- 화살표가 잔디밭을 누비며 수확
- 1000 기여도마다 달걀이 부화
- 병아리가 점점 늘어남
- Commits, PRs, Issues, Reviews 세부 통계

## Demo

`https://github-farmer.vercel.app/shindonghwi`

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shindonghwi/github-farmer)

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
