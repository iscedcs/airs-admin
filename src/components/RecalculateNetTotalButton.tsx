"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { recalculateNetTotal } from "../actions/recalculateNetTotal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RecalculateNetTotalButtonProps {
  vehicleId: string;
}

export function RecalculateNetTotalButton({
  vehicleId,
}: RecalculateNetTotalButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await recalculateNetTotal(vehicleId);
      toast.success("Net Total Updated Succesfully");
      router.refresh();
      setIsPending(false);
    } catch {
      toast.error("Something went wrong");
      setIsPending(false);
    }
  };

  return (
    <div className="grid">
      <Button onClick={handleClick} disabled={isPending} variant={"outline"}>
        {isPending ? "Recalculating..." : "Recalculate Net Total"}
      </Button>
    </div>
  );
}

