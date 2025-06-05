import { options } from "@/app/api/auth/options";
import AllTrackersView from "@/components/shared/all-trackers-view";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MapPage() {
  const session = await getServerSession(options);
  console.log({ session });
  if (!session?.user.id) redirect("/dashboard");
  return <AllTrackersView />;
}
