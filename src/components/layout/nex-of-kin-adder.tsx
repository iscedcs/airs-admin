import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { UpdateNextOfKinForm } from "./update-next-of-kin-form";

export default function NextOfKinAdder({
     image,
     name,
     description,
     vehicle,
}: {
     image?: string;
     name: string;
     description: string;
     vehicle: IVehicle;
}) {
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
                                             <div className="text-bodyBold uppercase">
                                                  {name}
                                             </div>
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
                              <DialogTitle>Update Vehicle Info</DialogTitle>
                              <DialogDescription>
                                   Add necessary details for fareflex
                                   installation
                              </DialogDescription>
                         </DialogHeader>
                         <UpdateNextOfKinForm vehicle={vehicle} />
                    </DialogContent>
               </Dialog>
          </>
     );
}
