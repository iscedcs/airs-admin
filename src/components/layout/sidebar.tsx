"use client";

import {
  SIDEBAR_LINKS,
  SIDEBAR_LINKS_ADMIN,
  SIDEBAR_LINKS_AGENT,
  SIDEBAR_LINKS_GREEN,
  SIDEBAR_NO_USER,
} from "@/lib/consts";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";
import { ModeToggle } from "../ui/dark-mode-toggle";
import { NavbarButton } from "./navbar-button";
import { Skeleton } from "../ui/skeleton";

export default function Sidebar() {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <div className="no-scrollbar fixed z-10 hidden h-full w-52 justify-between overflow-y-scroll bg-secondary px-5 md:flex">
        <div className="flex h-full w-full flex-col gap-3 pt-20">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded bg-primary/30" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="no-scrollbar fixed z-10 hidden h-full w-52 justify-between overflow-y-scroll bg-secondary px-5 md:flex">
      <div className="flex h-full w-full flex-col gap-3 pt-20">
        {SIDEBAR_LINKS_ADMIN.map((link, i) => (
          <NavbarButton
            key={i}
            title={link.title}
            href={link.href}
            icon={link.icon}
          />
        ))}
        <Separator />
        <ModeToggle />
      </div>
    </div>
  );
}
