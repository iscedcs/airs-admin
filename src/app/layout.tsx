import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/lib/providers/nextauth-provider";
import Provider from "@/lib/session-provider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TransPay - Seamless levy payment.",
  description: "Powered By ISCE",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Provider>
        <body className={`${lato.className}`}>
          <NextAuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="">
                <NextTopLoader color="#7F7433" showSpinner={false} />
                {children}
                <Toaster />
              </div>
            </ThemeProvider>
            <Analytics />
            {/* <SpeedInsights /> */}
          </NextAuthProvider>
        </body>
      </Provider>
    </html>
  );
}
