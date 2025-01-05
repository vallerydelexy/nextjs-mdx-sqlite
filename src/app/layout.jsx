import { LayoutHeader } from "@/components/LayoutHeader";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Rizki Aprita</title>
        <meta name="description" content="Portfolio Rizki Aprita" />
        <link rel="icon" href="/favicon.ico" />
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
