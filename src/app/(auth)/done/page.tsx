import { TickBox } from "@/lib/icons";
import Link from "next/dist/client/link";
import React from "react";

export default function Done() {
  return (
    <>
      {TickBox}
      <p className="mt-[15px] text-h4Bold">All Done!!!</p>
      <h2 className="w-[65%]">
        Your password has been Reset. You will have to Login Now
      </h2>
      <Link href="/auth">
        <button className="mt-5 w-full bg-primary-900 rounded-[14px] h-10 text-white">
          Continue
        </button>
      </Link>
    </>
  );
}
