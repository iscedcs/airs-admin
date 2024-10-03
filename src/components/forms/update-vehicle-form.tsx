"use client";
import {
     FNTC,
     VEHICLE_CATEGORIES,
     VEHICLE_CATEGORIES_PRICE,
} from "@/lib/consts";
import { loadingSpinner } from "@/lib/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
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
     FormLabel,
     FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { useToast } from "../ui/use-toast";

const vehicleFormSchema = z.object({
     category: z
          .string()
          .refine((value) => VEHICLE_CATEGORIES.includes(value), {
               message: "Invalid vehicle selected.",
          })
          .optional(),
     plate_number: z
          .string({
               required_error: "Enter your plate number.",
          })
          .optional(),
     owner_name: z
          .string()
          .min(5, {
               message: "Enter full name",
          })
          .optional(),
     owner_phone: z.string().optional(),
     // .regex(/^\+234[789][01]\d{8}$/, "Phone format (+2348012345678)")
     owner_address: z.string().optional(),
     owner_gender: z.optional(z.string()),
     owner_marital_status: z.string().optional(),
     owner_whatsapp: z.string().optional(),
     // owner_email: z.optional(z.string().email()),
     owner_valid_id: z.string().optional(),
     owner_nok_name: z.string().optional(),
     owner_nok_phone: z.string().optional(),
     owner_nok_relationship: z.string().optional(),
     asin_number: z.string().optional(),
     t_code: z.string().optional(),
     color: z.string().optional(),
     image: z.optional(
          z
               .string({
                    required_error: "Please add image.",
               })
               .min(5, { message: "Must be a valid Image link" }),
     ),
     status: z.string().optional(),
     type: z.string().optional(),
     vin: z.string().min(7, {
          message: "Enter valid chasis number",
     }),
     barcode: z.string().optional(),
     fairFlexImei: z.string().optional(),
     tracker_id: z.string().optional(),
     id: z.string().optional(),
     blacklisted: z.boolean().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function UpdateVehicleForm({ vehicle }: { vehicle: IVehicle }) {
     const defaultValues: Partial<VehicleFormValues> = {
          id: vehicle.id,
          category: vehicle.category ?? "",
          plate_number: vehicle.plate_number,
          asin_number: vehicle.asin_number ?? "",
          t_code: vehicle.t_code?.trim() !== "" ? vehicle.t_code : "NULL",
          color: vehicle.color ?? "",
          image: vehicle.image ?? "https://www.transpaytms.com/tricycle.jpg",
          status: vehicle.status ?? "ACTIVE",
          type: vehicle.type ?? "",
          vin: vehicle.vin ?? "",
          barcode: vehicle.barcode ?? "",
          blacklisted: vehicle.blacklisted ?? false,
          tracker_id: vehicle?.tracker?.terminal_id ?? "",
          fairFlexImei: vehicle?.tracker?.terminal_id ?? "",
          owner_name: vehicle.owner.name ?? "",
          owner_phone: vehicle.owner.phone ?? "",
          owner_address: vehicle.owner.address ?? "",
          owner_gender: vehicle.owner.gender ?? "OTHER",
          owner_marital_status: vehicle.owner.marital_status ?? "",
          owner_whatsapp: vehicle.owner.whatsapp ?? "",
          // owner_email: vehicle.owner.email ?? "",
          owner_valid_id: vehicle.owner.valid_id ?? "",
          owner_nok_name: vehicle.owner.nok_name ?? "",
          owner_nok_phone: vehicle.owner.nok_phone ?? "",
          owner_nok_relationship: vehicle.owner.nok_relationship ?? "",
     };
     const router = useRouter();
     const [disabled, setDisabled] = React.useState<boolean>(true);
     const [isLoading, setIsLoading] = React.useState<boolean>(false);
     const { toast } = useToast();
     const form = useForm<VehicleFormValues>({
          resolver: zodResolver(vehicleFormSchema),
          defaultValues,
          mode: "onChange",
     });

     async function onSubmit(data: VehicleFormValues) {
          setIsLoading(true);
          try {
               const updateVehicleResponse = await fetch(
                    "/api/create-vehicle",
                    {
                         method: "PUT",
                         body: JSON.stringify({
                              id: data.id,
                              category: data.category,
                              plate_number: data.plate_number,
                              asin_number:
                                   data.asin_number?.trim() !== ""
                                        ? data.asin_number
                                        : "NULL",
                              t_code:
                                   data.t_code?.trim() !== ""
                                        ? data.t_code
                                        : "NULL",
                              color: data.color,
                              image: data.image,
                              status: data.status,
                              type: data.type,
                              vin: data.vin,
                              barcode: data.barcode,
                              tracker_id: data.tracker_id,
                              blacklisted: data.blacklisted,
                              owner: {
                                   name: data.owner_name,
                                   phone: data.owner_phone,
                                   address: data.owner_address,
                                   gender: data.owner_gender,
                                   marital_status: data.owner_marital_status,
                                   // whatsapp: data.owner_whatsapp,
                                   // email: data.owner_email,
                                   valid_id: data.owner_valid_id,
                                   nok_name: data.owner_nok_name,
                                   // nok_phone: data.owner_nok_phone,
                                   nok_relationship:
                                        data.owner_nok_relationship,
                              },
                         }),
                    },
               );
               const result = await updateVehicleResponse.json();
               console.log({ result }, result.error);
               if (updateVehicleResponse.ok) {
                    toast({
                         title: "Vehicle Updated Successfully",
                    });
                    setIsLoading(false);
                    setDisabled(true);
                    router.refresh();
                    return NextResponse.json(result);
               } else {
                    setIsLoading(false);
                    toast({
                         title: "Vehicle NOT Updated",
                    });
                    return null;
               }
          } catch (error) {
               setIsLoading(false);
          }
     }

     return (
          <div className="mb-20">
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(onSubmit)}
                         className="flex w-full flex-col gap-5"
                    >
                         <div className="flex h-12 w-full shrink-0 items-center overflow-hidden rounded-2xl bg-primary text-white">
                              <div className="h-12 w-12 bg-black p-3">
                                   <Plus />
                              </div>
                              <div className="p-3">VEHICLE INFORMATION</div>
                         </div>
                         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              <FormField
                                   name="category"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Vehicle Category
                                             </FormLabel>

                                             <Select
                                                  onValueChange={field.onChange}
                                                  defaultValue={field.value}
                                                  disabled={disabled}
                                             >
                                                  <FormControl>
                                                       <SelectTrigger className="relative flex h-14 items-center rounded-2xl text-body">
                                                            <SelectValue placeholder="Select a vehicle category" />
                                                       </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                       {VEHICLE_CATEGORIES.map(
                                                            (cat, i) => (
                                                                 <SelectItem
                                                                      value={
                                                                           cat
                                                                      }
                                                                      key={i}
                                                                 >
                                                                      {cat
                                                                           .split(
                                                                                "_",
                                                                           )
                                                                           .join(
                                                                                " ",
                                                                           )}{" "}
                                                                      -{" "}
                                                                      {FNTC.format(
                                                                           VEHICLE_CATEGORIES_PRICE[
                                                                                i
                                                                           ]
                                                                                .price,
                                                                      )}
                                                                      /Week
                                                                 </SelectItem>
                                                            ),
                                                       )}
                                                  </SelectContent>
                                             </Select>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   name="plate_number"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Plate Number
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Plate Number"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              {/* <FormField
                                   name="asin_number"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  ASIN Number
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder={`Enter ASIN number`}
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              {/* <FormField
                                   name="t_code"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  T-Code
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter T-Code"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              {/* <FormField
                                   name="color"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem hidden>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Color
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter vehicle color"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              {/* <FormField
                                   name="image"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem hidden>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Image
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="IMAGE URL"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              {/* <FormField
                                   name="status"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem hidden>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Vehicle Status
                                             </FormLabel>

                                             <Select
                                                  onValueChange={field.onChange}
                                                  defaultValue={field.value}
                                                  disabled={disabled}
                                             >
                                                  <FormControl>
                                                       <SelectTrigger className="relative flex h-14 items-center rounded-2xl text-body">
                                                            <SelectValue placeholder="Choose Status" />
                                                       </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                       <SelectItem value="ACTIVE">
                                                            ACTIVE
                                                       </SelectItem>
                                                       <SelectItem value="INACTIVE">
                                                            INACTIVE
                                                       </SelectItem>
                                                  </SelectContent>
                                             </Select>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              <FormField
                                   name="vin"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Chasis Number
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter Chasis Number"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   name="type"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Vehicle Type
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter vehicle type"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              {/* <FormField
                                   name="barcode"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Sticker Number
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="T-01"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              {/* <FormField
                                   name="tracker_id"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  FareFlex ID
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter tracker ID"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                         </div>
                         <Separator className="my-2" />
                         <div className="flex h-12 w-full shrink-0 items-center overflow-hidden rounded-2xl bg-primary text-white">
                              <div className="h-12 w-12 bg-black p-3">
                                   <Plus />
                              </div>
                              <div className="p-3">
                                   OWNER&apos;S INFORMATION
                              </div>
                         </div>
                         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              <FormField
                                   name="owner_name"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Name
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter name of owner"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              {/* <FormField
                                   name="owner_whatsapp"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  WhatsApp Phone
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="+234"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                              <FormField
                                   name="owner_phone"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Phone
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="+234"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   name="owner_address"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Residential Address
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter address of owner"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   name="owner_gender"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Gender
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
                                                                 <SelectValue placeholder="Choose Gender" />
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
                              />
                              <FormField
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
                              />
                              {/* <FormField
                                   name="owner_email"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel className="pl-4 text-title1Bold">
                                                  Email
                                             </FormLabel>

                                             <FormControl>
                                                  <Input
                                                       className="relative flex h-14 items-center rounded-2xl text-body"
                                                       {...field}
                                                       disabled={disabled}
                                                       type="text"
                                                       placeholder="Enter email of owner"
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              /> */}
                         </div>
                         <div className="">
                              {!disabled && (
                                   <Button className="w-32" type="submit">
                                        {isLoading
                                             ? loadingSpinner
                                             : "Save Changes"}
                                   </Button>
                              )}
                         </div>
                    </form>
               </Form>
               {disabled && (
                    <div className="flex items-center justify-between gap-5">
                         <Button
                              className="w-32"
                              onClick={() => setDisabled(false)}
                              type="button"
                         >
                              Edit
                         </Button>
                         <Button
                              className="gap-1.5 px-0"
                              variant="link"
                              onClick={() => router.back()}
                         >
                              <ArrowLeft className="h-4 w-4" />
                              Go Back
                         </Button>
                    </div>
               )}
          </div>
     );
}
