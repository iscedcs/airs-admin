"use client";

import SingleTrackerView from "@/components/shared/single-tracker-view";
import { useParams } from "next/navigation";

export default function TrackerPage() {
  const params = useParams();
  const trackerId = params.id as string;

  return (
    <SingleTrackerView
      trackerId={trackerId}
      onBack={() => window.history.back()}
    />
  );
}
