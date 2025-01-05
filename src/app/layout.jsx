import { LayoutHeader } from "@/components/LayoutHeader";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>My App</title>
        <meta name="description" content="My app description" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="">
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
