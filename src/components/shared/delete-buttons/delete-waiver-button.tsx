"use client";
import { deleteIcon, loadingSpinner } from "@/lib/icons";
import React from "react";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function DeleteWaiverButton({ id }: { id: string }) {
     const router = useRouter();
     const { toast } = useToast();
     const [isLoading, setIsLoading] = React.useState<boolean>(false);
     const handleDelete = async (id: string) => {
          setIsLoading(true);
          try {
               const deleteWaiverResponse = await fetch("/api/create-waiver", {
                    method: "DELETE",
                    body: JSON.stringify({
                         id,
                    }),
               });
               const result = await deleteWaiverResponse.json();
               if (result.success) {
                    toast({
                         title: "Deleted Successfully",
                    });
                    setIsLoading(false);
                    toast({
                         title: result.message,
                    });
                    router.refresh();
                    return NextResponse.json(result);
               } else {
                    setIsLoading(false);
                    toast({
                         title: result,
                    });
               }
          } catch (error) {
               setIsLoading(false);
          }
     };
     return (
          <div
               className="cursor-pointer items-center"
               onClick={() => handleDelete(id)}
          >
               <span className="flex items-center justify-center">
                    {isLoading ? (
                         <div className="h-4 w-4 object-contain">
                              {loadingSpinner}
                         </div>
                    ) : (
                         <div className="flex gap-0.5">
                              <span className="mr-3 h-4 w-4">{deleteIcon}</span>
                              Cancel Waiver
                         </div>
                    )}
               </span>
          </div>
     );
}
