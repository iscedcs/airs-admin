import {
  SIDEBAR_LINKS,
  SIDEBAR_LINKS_ADMIN,
  SIDEBAR_LINKS_AGENT,
  SIDEBAR_LINKS_GREEN,
  SIDEBAR_NO_USER,
} from "@/lib/consts";
import { Separator } from "../ui/separator";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";
import { ModeToggle } from "../ui/dark-mode-toggle";
import { NavbarButton } from "./navbar-button";

export default async function Sidebar() {
  const session = await getServerSession(options);
  const ROLE = session?.user.role;
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
