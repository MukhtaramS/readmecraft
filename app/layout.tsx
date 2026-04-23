import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadMeCraft — Generate Beautiful READMEs in Seconds",
  description:
    "AI-powered README generator for developers. Create professional, well-structured GitHub READMEs instantly.",
  keywords: ["readme", "generator", "github", "developer tools", "ai", "markdown"],
  openGraph: {
    title: "ReadMeCraft — Generate Beautiful READMEs in Seconds",
    description: "AI-powered README generator for developers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" theme="system" />
      </body>
    </html>
  );
}
