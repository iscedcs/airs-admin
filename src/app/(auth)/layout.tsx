import Carousel from "@/components/layout/authCarousel";
import { SLIDES } from "@/lib/consts";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-5 bg-background p-3 lg:grid-cols-2 lg:p-5">
      <div className="hidden w-full items-center justify-center rounded-2xl bg-gradient-to-b from-primary-900 to-primary-700 p-3 text-white md:p-5 lg:flex lg:p-10">
        <div className="flex h-full max-w-[550px] flex-col justify-between">
          <div className="flex flex-col gap-12">
            <div className="text-h5">TRANSPAY</div>
            <div className="flex flex-col gap-4">
              <div className="text-h2 font-bold 2xl:text-h1">
                Ensure Drivers are Checked with Maximum Road Safety!!!
              </div>
              <h2 className="max-w-[485px] text-h5 2xl:text-h4">
                Where drivers payment are checked and road safety is ensured and
                money can be tracked
              </h2>
            </div>
          </div>
          <div>
            <div className="mt-8 flex w-full flex-col gap-7 rounded-2xl bg-primary-900 p-7 duration-700">
              <Carousel slides={SLIDES} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full items-start justify-center rounded-2xl lg:items-center">
        <div className="flex w-full max-w-[450px] flex-col items-center gap-5 md:gap-10 lg:ml-10 xl:ml-20">
          <Link
            href="/"
            className="flex h-20 w-20 items-center justify-center md:h-48 md:w-48"
          >
            <Image
              src="/authpageLogo.png"
              width={250}
              height={250}
              alt="logo"
              className="h-full w-full object-contain dark:invert"
            />
          </Link>
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
