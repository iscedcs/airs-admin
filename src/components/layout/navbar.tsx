import { options } from "@/app/api/auth/options";
import { getUser } from "@/lib/controller/users.controller";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserNav } from "../shared/user-nav-bar";

export default async function NavBar() {
     const session = await getServerSession(options);
     const user = await getUser(session?.user.id!);

     const isAgent = session?.user.id === "AGENT";
     return (
          <div className="fixed z-50 h-16 w-full shrink-0 bg-secondary/60 pr-5 backdrop-blur-sm">
               <div className="flex h-full items-center justify-between">
                    <Link href={"/"} className="w-52 shrink-0 px-5">
                         <Image
                              src={"/logo.png"}
                              height={30}
                              width={150}
                              className="shrink-0"
                              alt="Transpay Logo"
                         />
                    </Link>
                    <div className="flex items-center gap-3 text-primary-700">
                         {user ? (
                              <>
                                   {/* {!isAgent && <Notification />} */}
                                   <UserNav user={user} />
                              </>
                         ) : (
                              <Button asChild>
                                   <Link href="/sign-in">Login</Link>
                              </Button>
                         )}
                    </div>
               </div>
          </div>
     );
}
