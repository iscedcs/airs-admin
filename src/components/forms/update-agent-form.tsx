"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";
import { loadingSpinner } from "@/lib/icons";
import { NextResponse } from "next/server";
import { Checkbox } from "../ui/checkbox";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "../ui/dialog";
import DeleteAgentButton from "../shared/delete-buttons/delete-agent-button";

export const updateAgentFormSchema = z.object({
     name: z
          .string()
          .min(2, {
               message: "Username must be at least 2 characters.",
          })
          .max(30, {
               message: "Username must not be longer than 30 characters.",
          }),
     email: z
          .string({
               required_error: "Please enter an email.",
          })
          .email(),
     id_type: z.string({
          required_error: "Please select a mode of identification",
     }),
     blacklisted: z.boolean().optional(),
     id_number: z.string({
          required_error: "Please select a mode of identification",
     }),
     address: z
          .string()
          .min(2, {
               message: "Address must be at least 2 characters.",
          })
          .max(30, {
               message: "Address must not be longer than 100 characters.",
          }),
     lga: z.string({
          required_error: "Please enter LGA.",
     }),
     city: z.string({
          required_error: "Please enter city.",
     }),
     state: z.string({
          required_error: "Please enter state.",
     }),
     unit: z.string({
          required_error: "Please enter unit.",
     }),
     country: z.string({
          required_error: "Please enter country.",
     }),
     postal_code: z.string(),
     id: z.string(),
     phone: z
          .string({
               required_error: "Please enter phone number.",
          })
          .regex(/^\+234[789][01]\d{8}$/, "Phone format (+2348012345678)"),
     role: z.string({
          required_error: "Please choose role.",
     }),
});

export type UpdateAgentFormValues = z.infer<typeof updateAgentFormSchema>;

export function UpdateAgentForm({ agent }: { agent: IUserExtended }) {
     const [disabled, setDisabled] = React.useState<boolean>(true);
     const router = useRouter();
     const defaultValues: Partial<UpdateAgentFormValues> = {
          name: agent.name ?? "",
          email: agent.email ?? "",
          phone: agent.phone ?? "",
          role: agent.role ?? "",
          blacklisted: agent.blacklisted ?? "",
          city: agent.address.city ?? "",
          country: agent.address.country ?? "",
          id_number: agent.identification.number ?? "",
          id_type: agent.identification.type ?? "",
          lga: agent.address.lga ?? "" ?? "",
          postal_code: agent.address.postal_code ?? "",
          state: agent.address.state ?? "",
          unit: agent.address.unit ?? "",
          address: agent.address.text ?? "",
          id: agent.id ?? "",
     };

     const [isLoading, setIsLoading] = React.useState<boolean>(false);
     const { toast } = useToast();
     const form = useForm<UpdateAgentFormValues>({
          resolver: zodResolver(updateAgentFormSchema),
          defaultValues,
          mode: "onChange",
     });

     async function onSubmit(data: UpdateAgentFormValues) {
          setIsLoading(true);
          const payload = {
               name: data.name,
               email: data.email,
               phone: data.phone,
               role: data.role,
               blacklisted: data.blacklisted,
               address: {
                    text: data.address,
                    lga: data.lga,
                    city: data.city,
                    state: data.state,
                    unit: data.unit,
                    country: data.country,
                    postal_code: data.postal_code,
               },
               identification: {
                    type: data.id_type,
                    number: data.id_number,
               },
               id: data.id,
          };
          try {
               const createAgentResponse = await fetch("/api/create-agent", {
                    method: "PATCH",
                    body: JSON.stringify(payload),
               });
               const result = await createAgentResponse.json();
               console.log(result);
               if (
                    createAgentResponse.status > 199 &&
                    createAgentResponse.status < 299
               ) {
                    toast({
                         title: "Agent Updated Successfully",
                    });
                    setIsLoading(false);
                    setDisabled(true);
                    router.push("/agents");
                    return NextResponse.json(result);
               } else {
                    setIsLoading(false);
                    toast({
                         title: "Not Updated",
                    });
                    return null;
               }
          } catch (error) {
               setIsLoading(false);
          }
     }

     return (
       <>
         <Form {...form}>
           <form
             onSubmit={form.handleSubmit(onSubmit)}
             className="mb-20 flex flex-col gap-5"
           >
             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
               <FormField
                 name="name"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Name</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="Full Name"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="phone"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Phone Number</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="Enter phone number"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="email"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Email Address</FormLabel>
                     <FormControl>
                       <Input disabled placeholder="Email" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="role"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Agent Role</FormLabel>
                     <Input disabled value={"AIRS_AGENT"} />

                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="id_type"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Means of Identification</FormLabel>
                     <Select
                       onValueChange={field.onChange}
                       defaultValue={field.value}
                       disabled={disabled}
                     >
                       <FormControl>
                         <SelectTrigger className="h-12">
                           <SelectValue placeholder="Select a mean of Identification" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="NIN">NIN</SelectItem>
                         <SelectItem value="BVN">BVN</SelectItem>
                         <SelectItem value="PVC">Voters Card</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="id_number"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Identification Number</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="Enter identification number"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="address"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Address</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="Street"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="unit"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Unit</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="Unit"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="city"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>City</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="City"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="postal_code"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Postal Code</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="Postal Code"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 name="lga"
                 control={form.control}
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>LGA</FormLabel>
                     <FormControl>
                       <Input
                         disabled={disabled}
                         placeholder="LGA"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
             <FormField
               name="blacklisted"
               control={form.control}
               render={({ field }) => (
                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                   <FormControl>
                     <Checkbox
                       disabled={disabled}
                       checked={field.value}
                       onCheckedChange={field.onChange}
                     />
                   </FormControl>
                   <div className="space-y-1 leading-none">
                     <FormLabel>Blacklist Agent</FormLabel>
                   </div>
                 </FormItem>
               )}
             />
           </form>
         </Form>
       </>
     );
}
