import { LoginForm } from "@/components/forms/login-form";
import Carousel from "@/components/layout/authCarousel";
import { SLIDES } from "@/lib/consts";
import React from "react";

export default function SignInGeneral({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  return (
    <div>
      <div className=" capitalize text-h5Bold md:text-h4Bold mb-5 grid place-items-center">
        Login
      </div>
      <LoginForm error={searchParams.error} />    
      <div>
        <div className="w-full flex flex-col mt-8 gap-7 bg-primary-900 text-white p-7 lg:hidden duration-700 rounded-2xl">
          <Carousel slides={SLIDES} />
        </div>
      </div>
    </div>
  );
}
