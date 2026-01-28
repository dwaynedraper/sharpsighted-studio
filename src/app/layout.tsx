import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AccentProvider } from "@/components/providers/AccentProvider";
import { getThemeFromHeaders, getAccentFromHeaders } from "@/lib/theme/cookie-utils";
import { MainShell } from "@/components/main/MainShell";
import { RosShell } from "@/components/ros/RosShell";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Sharp Sighted Studio',
    default: 'Sharp Sighted Studio',
  },
  description: "Premium photography and creative collective",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie');
  const host = headersList.get('host') || '';

  const initialTheme = getThemeFromHeaders(cookieHeader);
  const initialAccent = getAccentFromHeaders(cookieHeader);

  // Determine which shell to use based on host
  const isRosHost = host.startsWith('ros.');
  const Shell = isRosHost ? RosShell : MainShell;

  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <head>
        {/* Anti-flash script - runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getCookie(name) {
                  const value = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
                  return value ? value.pop() : '';
                }
                
                // Apply theme immediately
                const theme = getCookie('ss-theme') || 'system';
                let resolvedTheme = theme;
                
                if (theme === 'system') {
                  resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                
                document.documentElement.classList.add(resolvedTheme);
                document.documentElement.setAttribute('data-theme', resolvedTheme);
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider initialTheme={initialTheme}>
          <AccentProvider initialAccent={initialAccent}>
            <Shell>{children}</Shell>
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
