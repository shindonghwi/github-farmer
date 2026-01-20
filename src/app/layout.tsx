import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Farmer - 잔디를 수확하고 병아리를 키우세요",
  description: "GitHub 잔디를 수확하고 병아리를 키우는 게임형 시각화",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "GitHub Farmer",
    description: "GitHub 잔디를 수확하고 병아리를 키우세요",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Farmer",
    description: "GitHub 잔디를 수확하고 병아리를 키우세요",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-github-bg text-github-text antialiased">
        {children}
      </body>
    </html>
  );
}
