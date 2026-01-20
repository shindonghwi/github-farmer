# GitHub Farmer

GitHub 잔디를 수확하고 병아리를 키우는 인터랙티브 기여도 시각화 게임

## Demo

**[github-farmer.vercel.app](https://github-farmer.vercel.app)**

## 사용법

GitHub 프로필 README에 추가:

```md
[![GitHub Farmer](https://img.shields.io/badge/GitHub%20Farmer-Play%20Now-39d353)](https://github-farmer.vercel.app/YOUR_USERNAME)
```

> `YOUR_USERNAME`을 본인 GitHub 유저네임으로 변경

### 예시

```md
[![GitHub Farmer](https://img.shields.io/badge/GitHub%20Farmer-Play%20Now-39d353)](https://github-farmer.vercel.app/shindonghwi)
```

[![GitHub Farmer](https://img.shields.io/badge/GitHub%20Farmer-Play%20Now-39d353)](https://github-farmer.vercel.app/shindonghwi)

## 기능

- 화살표가 1년간의 GitHub 잔디를 수확
- 1000 기여도마다 달걀 부화 → 병아리 등장
- Commits, PRs, Issues, Reviews 통계
- 완료 시 파도 애니메이션

## 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shindonghwi/github-farmer&env=GITHUB_TOKEN)

| 환경변수 | 설명 |
|---------|------|
| `GITHUB_TOKEN` | [Personal Access Token](https://github.com/settings/tokens) (`read:user`) |

## License

MIT
