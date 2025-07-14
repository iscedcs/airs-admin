import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: "Transpay Payment Status Checker",
    template: "%s | Transpay TMS"
  },
  description: "Check your payment status instantly with Transpay. Enter your payment reference to verify transactions, view payment details, and print official receipts.",
  keywords: [
    "transpay",
    "payment status",
    "commercial vehicle fee",
    "anambra state",
    "payment verification",
    "vehicle operations fee",
    "payment receipt",
    "transaction status",
    "nigeria payment",
    "cbs payment system"
  ],
  authors: [{ name: "Transpay TMS" }],
  creator: "Transpay",
  publisher: "Transpay Payment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://transpaytms.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    title: "Transpay Payment Status Checker Verify Your Commercial Vehicle Fee",
    description: "Instantly check your payment status. Enter your payment reference to verify transactions and print official receipts.",
    siteName: "Transpay TMS",
    images: [
      {
        url: "/logo2.png",
        width: 1200,
        height: 630,
        alt: "Transpay Payment Status Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transpay Payment Status Checker",
    description: "Check your payment status instantly with Transpay.",
    images: ["/logo2.png"],
    creator: "@transpay_ng",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "finance",
}

export default function CheckPaymentLayout({children}:{children: ReactNode}) {
  return children
}
