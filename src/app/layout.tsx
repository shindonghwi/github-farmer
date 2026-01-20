import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Symphony - GitHub 기여도를 음악으로",
  description: "당신의 코딩 여정을 들어보세요. GitHub 기여도가 음악이 됩니다.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Code Symphony",
    description: "당신의 코딩 여정을 들어보세요",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Symphony",
    description: "당신의 코딩 여정을 들어보세요",
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
