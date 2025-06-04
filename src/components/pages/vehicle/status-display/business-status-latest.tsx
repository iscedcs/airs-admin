import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, User } from "lucide-react";
import { InfoItem } from "./individual-status";
import ExtraRoles from "../extra-roles";

export default function BusinessStatusLatest({
  vehicle,
  role,
}: {
  vehicle: IVehicle;
  role?: string;
}) {
  const company = vehicle.company!;
  const isBarcodeValid = !!vehicle.barcode;

  // @ts-ignore
  const hasFareFlex =
    !!vehicle?.fairFlexImei && vehicle?.fairFlexImei.trim() !== "";
  const hasSticker = !!vehicle?.barcode && vehicle?.barcode.trim() !== "";
  return (
    <div className=" max-w-4xl mx-auto">
      <div className=" bg-primary p-[20px] rounded-t-lg text-center ">
        <div className=" flex flex-col gap-2 bg-secondary p-[20px] text-center rounded-lg ">
          <span className=" text-lg">
            <p className=" text-sm font-light uppercase">Vehicle Owner</p>
            <p className=" font-bold">{vehicle?.owner.name}</p>
          </span>
          <span className=" text-lg">
            <p className=" text-sm font-light uppercase">Vehicle Type</p>
            <p className=" font-bold">{vehicle?.category}</p>
          </span>
          <span className=" text-lg">
            <p className=" text-sm font-light uppercase">Organisation</p>
            <p className=" font-bold">{company.name}</p>
          </span>
        </div>
        <div className=" bg-secondary rounded-lg px-[15px] p-[10px] mt-[10px]  ">
          <Tabs className="mb-2 mt-[10px] w-full" defaultValue="overview">
            <TabsList
              className={`p-1" grid w-full grid-cols-3 rounded-lg bg-muted`}
            >
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-background"
              >
                <User className="mr-2 h-5 w-5" />
                <span className="hidden md:inline-block">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                className="data-[state=active]:bg-background"
              >
                <Car className="mr-2 h-5 w-5" />
                <span className="hidden md:inline-block">Vehicles</span>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-background"
              >
                <FileText className="mr-2 h-5 w-5" />{" "}
                <span className="hidden md:inline-block">Documents</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className=" gap-3 text-left grid grid-cols-1 md:grid-cols-2"
              value="overview"
            >
              {/* @ts-ignore */}
              <InfoItem label="TCODE" value={vehicle?.t_code} />
              <InfoItem label="ORGANISATION NAME" value={company.name} />
              {/* @ts-ignore */}
              {/* <InfoItem
                label="ASIN"
                value={vehicle?.asin_number ? vehicle?.asin_number : "NULL"}
              /> */}
              {/* @ts-ignore */}
              <InfoItem label="PLATE NUMBER" value={vehicle?.plate_number} />
              <InfoItem
                label="STICKER"
                className={hasSticker ? "" : "text-destructive-foreground"}
                // {/* @ts-ignore */}
                value={hasSticker ? vehicle?.barcode : "NO STICKER ADDED"}
              />
              <InfoItem
                label="FAREFLEX"
                className={hasFareFlex ? "" : "text-destructive-foreground"}
                // {/* @ts-ignore */}
                value={
                  hasFareFlex ? vehicle?.fairFlexImei : "NO FAREFLEX INSTALLED"
                }
              />
            </TabsContent>
            <TabsContent
              className=" gap-3 text-left grid grid-cols-1 md:grid-cols-2"
              value="vehicle"
            >
              <InfoItem
                label="CHASIS NUMBER"
                value={vehicle?.vin ?? "NO CHASIS NUMBER"}
              />
              {/* @ts-ignore */}
              <InfoItem label="TCODE" value={vehicle?.t_code} />
              <InfoItem
                label="STICKER ID"
                // {/* @ts-ignore */}
                value={vehicle?.barcode ?? "NO STICKER ID"}
              />
              {/* @ts-ignore */}
              <InfoItem label="CATEGORY" value={vehicle?.category} />
            </TabsContent>
            {/* <TabsContent className=" text-center" value="wallet">
              <p className="">Coming soon</p>
            </TabsContent> */}
            <TabsContent
              className=" gap-3 text-left grid grid-cols-1 md:grid-cols-2"
              value="documents"
            >
              <InfoItem
                label="Owner Name"
                // {/* @ts-ignore */}
                value={vehicle?.owner.name ?? "NO OWNER NAME"}
              />
              <InfoItem
                label="Gender"
                // {/* @ts-ignore */}
                value={vehicle?.owner.gender ?? "NO OWNER GENDER"}
              />
              {role && (
                <>
                  <InfoItem
                    label="Phone"
                    // {/* @ts-ignore */}
                    value={vehicle?.owner.phone ?? "NO OWNER PHONE"}
                  />
                  <InfoItem
                    label="Marital Status"
                    // {/* @ts-ignore */}
                    value={vehicle?.owner.marital_status ?? "NO MARITAL STATUS"}
                  />
                  <InfoItem
                    label="Address"
                    // {/* @ts-ignore */}
                    value={vehicle?.owner.address ?? "NO OWNER ADDRESS"}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
          {role && (
            <ExtraRoles
              isBarcodeValid={isBarcodeValid}
              role={role}
              vehicle={vehicle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
