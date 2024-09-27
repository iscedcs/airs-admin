import type { Metadata } from "next";
import Sidebar from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "TransPay - Seamless levy payment.",
  description: "Powered By ISCE",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar />
      <div className="ml-[208px]">{children}</div>
    </div>
  );
}
