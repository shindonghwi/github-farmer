# GitHub Farmer

GitHub 잔디를 수확하고 병아리를 키우는 게임형 기여도 시각화

## 내 GitHub 프로필에 추가하기

### 1. 링크로 추가

GitHub 프로필 README에 아래 링크 추가:

```md
[나의 GitHub Farmer 보러가기](https://github-farmer.vercel.app/YOUR_USERNAME)
```

`YOUR_USERNAME`을 본인 GitHub 유저네임으로 변경하세요.

### 예시

```md
[나의 GitHub Farmer 보러가기](https://github-farmer.vercel.app/shindonghwi)
```

결과: [나의 GitHub Farmer 보러가기](https://github-farmer.vercel.app/shindonghwi)

## 기능

- 화살표가 1년간의 GitHub 잔디를 수확
- 1000 기여도마다 달걀이 부화하여 병아리 등장
- Commits, PRs, Issues, Reviews 세부 통계 표시
- 게임 완료 후 잔디밭 파도 효과

## 직접 배포하기

자신만의 인스턴스를 운영하고 싶다면:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shindonghwi/github-farmer&env=GITHUB_TOKEN&envDescription=GitHub%20Personal%20Access%20Token%20(read:user%20권한%20필요))

**필요한 환경변수:**
- `GITHUB_TOKEN`: [GitHub Personal Access Token](https://github.com/settings/tokens) (`read:user` 권한)

## License

MIT
