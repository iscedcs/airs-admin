import { getVehicleRegistrar } from "@/actions/audit-trails";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import Image from "next/image";

export default async function ViewRegistrar({
  image,
  name,
  description,
  id,
  t_code,
  plate_number,
}: {
  image?: string;
  name: string;
  description: string;
  id: string;
  t_code: string;
  plate_number: string;
}) {
  const audit = await getVehicleRegistrar(plate_number);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="h-[300px] w-full p-1.5 md:p-2.5">
            <Card className="h-full overflow-hidden bg-secondary shadow-md transition-all hover:shadow-xl">
              <CardHeader className="h-[160px] w-full overflow-hidden p-0">
                <Image
                  src={image || "/tricycle.jpg"}
                  alt={name}
                  height={140}
                  width={278}
                  className="h-full w-full object-cover object-center"
                />
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex flex-col gap-1.5">
                  <div className="text-bodyBold uppercase">{name}</div>
                  <div className="text-captionBold md:text-bodyBold">
                    {description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Vehicle was onboarded by</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              {!audit && "No Agent Found"}
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold">Name:</div>
                {
                  //@ts-ignore
                  audit?.meta?.user.name
                }
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold">Email:</div>
                {
                  //@ts-ignore
                  audit?.meta?.user.email
                }
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold">Date:</div>
                {/* {format(audit?.created_at!, "MMM dd, h:mm a")} */}
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold">Action:</div>
                {audit?.name.split("_").join(" ")}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
