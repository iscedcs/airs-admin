import type { Metadata } from "next";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/options";

export const metadata: Metadata = {
  title: "TransPay - Seamless levy payment.",
  description: "Powered By ISCE",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(options)) ?? null;
  return (
    <div className="">
      <Navbar />
      <div className="">
        <Sidebar />
        <div
          className={`pt-[60px] ${
            session ? "md:ml-[208px]" : "md:ml-0"
          } `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
