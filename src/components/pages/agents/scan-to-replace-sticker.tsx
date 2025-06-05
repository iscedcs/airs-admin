"use client";
import { getVehicleBySticker } from "@/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { copyIcon, successIcon } from "@/lib/icons";
import localforage from "localforage";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ScanToReplaceSticker({
  id,
  t_code,
}: {
  id: string;
  t_code: string;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const scannerRef = useRef<QrScanner | null>(null);
  const router = useRouter();

  const [scannedHistory, setScannedHistory] = useState<string[]>([]);

  useEffect(() => {
    localforage.getItem("scannedHistory").then((history) => {
      if (history) {
        setScannedHistory(history as string[]);
      }
    });
  }, []);

  const startScan = () => {
    setResult(null);
    setOpen(false);
    setScanning(true);
    setScanCount(0);
    scannerRef.current?.start();
  };

  const handleScanResult = async (result: string) => {
    setScanning(false);
    const resultId = result.split("status/")[1];
    setResult(result);
    setResultId(resultId);
    if (!resultId || resultId.trim() === "") {
      toast.error(`Invalid Sticker`);
      return null;
    }
    const existingVehicle = await getVehicleBySticker(resultId);
    if (existingVehicle?.success) {
      toast.warning(
        `Sticker already assigned to vehicle with T-CODE ${existingVehicle.success.data.vehicle?.t_code}`
      );
      return null;
    }
    setOpen(true);
    setScanning(false);
    setScanCount(scanCount + 1);

    try {
      const replaceStickerResponse = await fetch("/api/replace-sticker", {
        method: "PUT",
        body: JSON.stringify({
          id,
          barcode: resultId,
        }),
      });
      const result = await replaceStickerResponse.json();
      if (replaceStickerResponse.ok) {
        toast.success("Sticker replaced Successfully");
        router.refresh();
        return null;
      } else {
        toast.error("Sticker NOT Added");
        return null;
      }
    } catch (error) {
      toast.error("Sticker NOT Added");
      return null;
    }

    // const updatedHistory = [result, ...scannedHistory];
    // setScannedHistory(updatedHistory);
    // localforage.setItem("scannedHistory", updatedHistory);

    // if (scanCount + 1 >= 10) {
    //      scannerRef.current?.destroy();
    // }
  };

  useEffect(() => {
    const videoElement = document.getElementById("video") as HTMLVideoElement;

    scannerRef.current = new QrScanner(videoElement, handleScanResult);

    if (scanning) {
      scannerRef.current?.start();
    }

    return () => {
      scannerRef.current?.destroy();
    };
  }, [scanning]);

  return (
    <div className="">
      <div className="w-full max-w-lg">
        <Card className="aspect-square w-full overflow-hidden">
          <video className="h-full w-full object-cover" id="video" />
        </Card>
        <Button
          className="mt-4 w-full"
          onClick={startScan}
          disabled={scanning || scanCount >= 10}
        >
          Start Scan
        </Button>
      </div>
      {/* {result && (
                    <Card className="mb-5 w-[250px] overflow-hidden border border-primary p-3">
                         <QRCode value={result} size={224} className="m-auto" />
                    </Card>
               )} */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-secondary">
          <div className="max-w-60 mx-auto w-full flex-col">
            <div className="mb-5 flex flex-col items-center gap-5">
              <div className="h-20 w-20 text-awesome-foreground">
                {successIcon}
              </div>
              <div className="text-xl">Sticker Scanned</div>
            </div>
            <div className="mb-5 flex flex-col text-center">
              <div>Sticker ID</div>
              <div>{resultId}</div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="flex gap-2 rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText(result as string);
                  toast.info("COPIED!");
                }}
              >
                <div className="h-4 w-4">{copyIcon}</div>
                Copy
              </Button>
              <Button className="gap-1.5" variant={"outline"}>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Adding Sticker
              </Button>
              {/* <Button
								onClick={() => {
									setResult(null);
									const videoElement =
										document.getElementById(
											'video'
										) as HTMLVideoElement;
									const scanner = new QrScanner(
										videoElement,
										() => {}
									);
									scanner.start();
								}}
								className='rounded-xl'
							>
								Scan New
							</Button> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
