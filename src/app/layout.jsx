import { LayoutHeader } from "@/components/LayoutHeader";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import { ThemeProvider } from "@/components/theme-provider";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Rizki Aprita</title>
        <meta
          name="description"
          content="Rizki Aprita: Software Engineer Surabaya, Indonesia"
        />
        <link rel="icon" href="/favicon.ico" />

        <meta itemprop="name" content="Rizki Aprita" />
        <meta
          itemprop="description"
          content="Rizki Aprita: Software Engineer Surabaya, Indonesia"
        />
        <meta itemprop="image" content="/images/meta.jpg" />

        <meta property="og:url" content="https://aprita.web.id/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rizki Aprita" />
        <meta
          property="og:description"
          content="Rizki Aprita: Software Engineer Surabaya, Indonesia"
        />
        <meta property="og:image" content="/images/meta.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rizki Aprita" />
        <meta
          name="twitter:description"
          content="Rizki Aprita: Software Engineer Surabaya, Indonesia"
        />
        <meta name="twitter:image" content="/images/meta.jpg" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
