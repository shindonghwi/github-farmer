# GitHub Farmer

GitHub 잔디를 수확하고 병아리를 키우는 게임형 시각화 웹앱.

## Features

- GitHub 기여도 그래프를 게임처럼 시각화
- 화살표가 잔디밭을 누비며 기여도 수확
- 1000 기여도마다 달걀 부화 → 병아리 등장
- Commits, PRs, Issues, Reviews 세부 통계

## Demo

https://github-farmer.vercel.app/shindonghwi

## 사용법

```
https://github-farmer.vercel.app/{GitHub_유저네임}
```

## 로컬 실행

### 1. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 GitHub Token 입력:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

> GitHub Token: [Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
> 필요 권한: `read:user`

### 2. 실행

```bash
npm install
npm run dev
```

http://localhost:3000 접속

## 배포 (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shindonghwi/github-farmer&env=GITHUB_TOKEN&envDescription=GitHub%20Personal%20Access%20Token%20with%20read:user%20scope)

1. 위 버튼 클릭 또는 Vercel에서 GitHub 레포 import
2. Environment Variables에 `GITHUB_TOKEN` 추가
3. Deploy

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Canvas API
- GitHub GraphQL API

## License

MIT
