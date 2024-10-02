"use client";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { loadingSpinner } from "@/lib/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

const UpdateNextOfKinFormSchema = z.object({
     // gender: z.string({ required_error: "Choose Gender" }),
     nok_name: z.string({ required_error: "Add next of kin name." }),
     nok_phone: z
          .string()
          .regex(/^\+234[789][01]\d{8}$/, "Phone format (+2348012345678)"),
     nok_relationship: z.string({
          required_error: "Add next of kin relationship.",
     }),
     // marital_status: z.string({ required_error: "Add marital status." }),
});

type VehicleFormValues = z.infer<typeof UpdateNextOfKinFormSchema>;

export function UpdateNextOfKinForm({ vehicle }: { vehicle: IVehicle }) {
     const router = useRouter();

     const defaultValues: Partial<VehicleFormValues> = {
          nok_name: vehicle.owner.nok_name ?? "",
          nok_phone: vehicle.owner.nok_phone ?? "",
          nok_relationship: vehicle.owner.nok_relationship ?? "OTHERS",
          // gender: vehicle.owner.gender ?? "",
          // marital_status: vehicle.owner.marital_status ?? "",
     };
     const [isLoading, setIsLoading] = React.useState<boolean>(false);
     const { toast } = useToast();
     const form = useForm<VehicleFormValues>({
          resolver: zodResolver(UpdateNextOfKinFormSchema),
          defaultValues,
          mode: "onChange",
     });

     async function onSubmit(data: VehicleFormValues) {
          setIsLoading(true);
          try {
               const addFareFlexResponse = await fetch("/api/create-vehicle", {
                    method: "PUT",
                    body: JSON.stringify({
                         id: vehicle.id,
                         owner: {
                              // gender: data.gender,
                              // marital_status: data.marital_status,
                              nok_name: data.nok_name,
                              nok_phone: data.nok_phone,
                              nok_relationship: data.nok_relationship,
                         },
                    }),
               });
               const result = await addFareFlexResponse.json();
               if (
                    addFareFlexResponse.status > 199 &&
                    addFareFlexResponse.status < 299
               ) {
                    toast({
                         title: "Fareflex Added Successfully",
                    });
                    setIsLoading(false);
                    router.refresh();
                    return NextResponse.json(result);
               } else {
                    setIsLoading(false);
                    toast({
                         title: "Fareflex NOT Added",
                    });
                    return null;
               }
          } catch (error) {
               setIsLoading(false);
          }
     }

     return (
          <div className="w-full">
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(onSubmit)}
                         className="flex w-full flex-col gap-5"
                    >
                         <div className="grid gap-3">
                              <FormField
                                   name="nok_name"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       type="text"
                                                       placeholder="Name of Next of Kin"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   name="nok_relationship"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormControl>
                                                  <Select
                                                       onValueChange={
                                                            field.onChange
                                                       }
                                                       defaultValue={
                                                            field.value
                                                       }
                                                  >
                                                       <FormControl>
                                                            <SelectTrigger className="relative flex h-14 items-center rounded-2xl text-body">
                                                                 <SelectValue placeholder="Choose Next of Kin Relationship" />
                                                            </SelectTrigger>
                                                       </FormControl>
                                                       <SelectContent>
                                                            <SelectItem value="BROTHER">
                                                                 BROTHER
                                                            </SelectItem>
                                                            <SelectItem value="SISTER">
                                                                 SISTER
                                                            </SelectItem>
                                                            <SelectItem value="MOTHER">
                                                                 MOTHER
                                                            </SelectItem>
                                                            <SelectItem value="FATHER">
                                                                 FATHER
                                                            </SelectItem>
                                                            <SelectItem value="FRIEND">
                                                                 FRIEND
                                                            </SelectItem>
                                                            <SelectItem value="OTHERS">
                                                                 OTHERS
                                                            </SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   name="nok_phone"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       type="text"
                                                       placeholder="Enter Next of Kin Phone number"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              {/* <FormField
                                   name="gender"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormControl>
                                                  <Select
                                                       onValueChange={
                                                            field.onChange
                                                       }
                                                       defaultValue={
                                                            field.value
                                                       }
                                                  >
                                                       <FormControl>
                                                            <SelectTrigger className="relative flex h-14 items-center rounded-2xl text-body">
                                                                 <SelectValue placeholder="Choose Next of Kin Gender" />
                                                            </SelectTrigger>
                                                       </FormControl>
                                                       <SelectContent>
                                                            <SelectItem value="MALE">
                                                                 MALE
                                                            </SelectItem>
                                                            <SelectItem value="FEMALE">
                                                                 FEMALE
                                                            </SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              {/*  <FormField
                                   name="owner_marital_status"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Marital Status
                                             </FormLabel>

                                             <FormControl>
                                                  <Select
                                                       onValueChange={
                                                            field.onChange
                                                       }
                                                       defaultValue={
                                                            field.value
                                                       }
                                                       disabled={disabled}
                                                  >
                                                       <FormControl>
                                                            <SelectTrigger className="relative flex h-14 items-center rounded-2xl text-body">
                                                                 <SelectValue placeholder="Choose Status" />
                                                            </SelectTrigger>
                                                       </FormControl>
                                                       <SelectContent>
                                                            <SelectItem value="SINGLE">
                                                                 SINGLE
                                                            </SelectItem>
                                                            <SelectItem value="MARRIED">
                                                                 MARRIED
                                                            </SelectItem>
                                                            <SelectItem value="DIVORCED">
                                                                 DIVORCED
                                                            </SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                         </div>
                         <Button className="w-full" type="submit">
                              {isLoading
                                   ? loadingSpinner
                                   : "Update Vehicle Infomation"}
                         </Button>
                    </form>
               </Form>
          </div>
     );
}
