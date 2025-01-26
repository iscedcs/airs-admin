"use client";

import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const frequencies = ["all", "yearly", "monthly", "weekly", "daily"] as const;

export function FrequencySwitch({
  currentFrequency,
}: {
  currentFrequency: (typeof frequencies)[number];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleFrequencyChange = (newFrequency: string) => {
    router.push(
      `/history/${newFrequency}${
        pathname.includes("?") ? pathname.slice(pathname.indexOf("?")) : ""
      }`
    );
  };

  return (
    <Tabs value={currentFrequency} onValueChange={handleFrequencyChange}>
      <TabsList>
        {frequencies.map((freq) => (
          <TabsTrigger key={freq} value={freq} className="capitalize">
            {freq}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
