import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SELAH 2026 | Pause. Explore. Renew.",
  description: "Inter-church youth cultural & sports festival uniting congregations in athletics, creative expression, and holy reverence.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/top_page/Selah_Logo_BG.png", type: "image/png" },
    ],
    apple: [
      { url: "/top_page/Selah_Logo_BG.png" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('selah_has_entered') === 'true' || document.cookie.indexOf('selah_has_entered=1') !== -1) {
                  document.documentElement.classList.add('selah-entered');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
