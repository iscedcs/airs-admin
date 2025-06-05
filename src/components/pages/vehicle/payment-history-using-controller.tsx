import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FNTC } from "@/lib/consts";
import { getVehiclePaymentHistoryById } from "@/lib/controller/vehicle-controller";
import { format } from "date-fns";

export default async function PaymentHistoryUsingController({
     hasMore = true,
     vehicleId
}: {
     hasMore?: boolean;
     vehicleId: string
}) {
     const paymentHistory = await getVehiclePaymentHistoryById(vehicleId)
     return (
          <div className="space-y-2">
               <Table className=" bg-primary-100 rounded-lg">
                    <TableHeader>
                         <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {paymentHistory && (
                              paymentHistory.map((payment, k) => (
                                   <TableRow key={k}>
                                        <TableCell>{format(new Date(payment.payment_date), "MMMM dd, hh:mm aa")}</TableCell>
                                        <TableCell>{FNTC.format(Number(payment.transaction_amount))}</TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>
          </div>
     );
}
