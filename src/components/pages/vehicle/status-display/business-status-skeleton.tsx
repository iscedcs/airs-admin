import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

export default function BusinessStatusSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className=" bg-primary p-[20px] rounded-t-lg text-center ">
        <div className=" flex flex-col gap-2 bg-secondary p-[20px] text-center rounded-lg ">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
        <div className=" bg-secondary rounded-lg px-[15px] p-[10px] mt-[10px]  ">
          <Tabs className="mb-2 mt-[10px] w-full" defaultValue="overview">
            <TabsList
              className={`p-1 gap-1 grid w-full grid-cols-3 rounded-lg bg-muted`}
            >
              <Skeleton className="bg-secondary w-full h-full" />
              <Skeleton className="bg-secondary w-full h-full" />
              <Skeleton className="bg-secondary w-full h-full" />
            </TabsList>
            <TabsContent className="grid min-h-[300px]" value="overview">
              <Skeleton className="h-full w-full bg-muted" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
