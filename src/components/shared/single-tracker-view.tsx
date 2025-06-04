"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Navigation,
  Clock,
  Battery,
  Info,
  MapPin,
  RotateCw,
} from "lucide-react";

interface TrackerDetails {
  id: string;
  name: string;
  lat: number;
  lon: number;
  speed?: number;
  heading?: number;
  lastUpdated?: string;
  batteryLevel?: number;
  status?: "active" | "idle" | "offline";
  address?: string;
}

// Custom marker with pulse animation
const PulsingMarker = ({
  position,
  heading = 0,
}: {
  position: { lat: number; lng: number };
  heading?: number;
}) => {
  return (
    <AdvancedMarker position={position}>
      <div className="relative">
        {/* Pulsing circle animation */}
        <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping"></div>
        <div className="absolute -inset-3 rounded-full bg-primary/30"></div>

        {/* Direction indicator */}
        <div
          className="relative bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg z-10"
          style={{ transform: `rotate(${heading}deg)` }}
        >
          <Navigation className="h-5 w-5" />
        </div>
      </div>
    </AdvancedMarker>
  );
};

// Map content component
function TrackerMapContent({ tracker }: { tracker: TrackerDetails }) {
  const map = useMap();
  const position = { lat: tracker.lat, lng: tracker.lon };

  // Center map on tracker when position changes
  useEffect(() => {
    if (map) {
      map.panTo(position);
    }
  }, [map, tracker.lat, tracker.lon]);

  return <PulsingMarker position={position} heading={tracker.heading} />;
}

// Format date to relative time (e.g., "2 minutes ago")
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  return `${Math.floor(diffSec / 86400)} days ago`;
}

// Battery level indicator
function BatteryIndicator({ level = 0 }: { level?: number }) {
  const batteryColor =
    level > 70
      ? "text-green-500"
      : level > 30
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="flex items-center gap-2">
      <Battery className={batteryColor} />
      <span className={batteryColor}>{level}%</span>
    </div>
  );
}

// Status badge
function StatusBadge({
  status = "offline",
}: {
  status?: "active" | "idle" | "offline";
}) {
  const statusConfig = {
    active: { label: "Active", className: "bg-green-500" },
    idle: { label: "Idle", className: "bg-amber-500" },
    offline: { label: "Offline", className: "bg-gray-500" },
  };

  const config = statusConfig[status];

  return <Badge className={config.className}>{config.label}</Badge>;
}

function getRandomAnambraAddress() {
  const locations = [
    "Awka, Anambra State, Nigeria",
    "Onitsha Main Market, Onitsha, Anambra State",
    "Eke Awka Market, Awka, Anambra State",
    "Nnamdi Azikiwe University, Awka, Anambra State",
    "Ekwulobia, Anambra State, Nigeria",
    "Nnewi, Anambra State, Nigeria",
    "Ogbaru, Anambra State, Nigeria",
    "Ihiala, Anambra State, Nigeria",
    "Aguata, Anambra State, Nigeria",
    "Orumba North, Anambra State, Nigeria",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

export default function SingleTrackerView({
  trackerId,
  initialData,
  onBack,
}: {
  trackerId: string;
  initialData?: TrackerDetails;
  onBack?: () => void;
}) {
  const [tracker, setTracker] = useState<TrackerDetails>(
    initialData || {
      id: trackerId,
      name: "Unknown Fair Flex",
      lat: 40.7128,
      lon: -74.006,
      status: "offline",
    }
  );

  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // API key
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    "AIzaSyB-5fVMfpSgqz0AAGjNDIcMDDLqOIhkKhk";

  // Fetch tracker data
  const fetchTrackerData = useCallback(async () => {
    if (!trackerId) return;

    try {
      setRefreshing(true);

      // Simulate API call - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - random location in Anambra State, Nigeria
      const mockData: TrackerDetails = {
        id: trackerId,
        name: `Fair Flex ${trackerId.slice(0, 4)}`,
        lat: 6.2 + (Math.random() - 0.5) * 0.1, // Centered around Anambra State (6.2°N)
        lon: 7.0 + (Math.random() - 0.5) * 0.1, // Centered around Anambra State (7.0°E)
        speed: Math.floor(Math.random() * 80),
        heading: Math.floor(Math.random() * 360),
        lastUpdated: new Date().toISOString(),
        batteryLevel: Math.floor(Math.random() * 100),
        status:
          Math.random() > 0.2
            ? "active"
            : Math.random() > 0.5
            ? "idle"
            : "offline",
        address: getRandomAnambraAddress(),
      };

      setTracker(mockData);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tracker data");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [trackerId]);

  // Initial data fetch
  useEffect(() => {
    if (!initialData) {
      fetchTrackerData();
    }
  }, [fetchTrackerData, initialData]);

  // Auto-refresh every 30 seconds
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       fetchTrackerData();
  //     }, 30000);

  //     return () => clearInterval(interval);
  //   }, [fetchTrackerData]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchTrackerData();
  }, [fetchTrackerData]);

  // Handle back button click
  const handleBack = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  // Map options
  const mapOptions = useMemo(
    () => ({
      mapId: "single-fair-flex-map",
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    }),
    []
  );

  if (!apiKey) {
    return (
      <div className="h-[calc(100svh-100px)] w-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Google Maps API key is missing</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[calc(100svh-100px)] w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100svh-100px)] w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100svh-100px)] w-full flex flex-col md:flex-row">
      {/* Map section */}
      <div className="relative h-1/2 md:h-full md:w-2/3">
        <APIProvider apiKey={apiKey}>
          <GoogleMap
            className="h-full w-full"
            zoom={13}
            center={{ lat: tracker.lat, lng: tracker.lon }}
            {...mapOptions}
          >
            <TrackerMapContent tracker={tracker} />
          </GoogleMap>
        </APIProvider>

        {/* Controls overlay */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="bg-white"
            >
              Back
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white"
          >
            <RotateCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info section */}
      <div className="h-1/2 md:h-full md:w-1/3 p-4 overflow-y-auto bg-gray-50">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{tracker.name}</CardTitle>
              <StatusBadge status={tracker.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Location info */}
              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location
                </div>
                <div className="text-sm text-gray-500">
                  <div>Latitude: {tracker.lat.toFixed(6)}</div>
                  <div>Longitude: {tracker.lon.toFixed(6)}</div>
                  {tracker.address && (
                    <div className="mt-1 font-medium text-gray-700">
                      {tracker.address}
                    </div>
                  )}
                </div>
              </div>

              {/* Movement info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <Compass className="h-4 w-4" /> Heading
                  </div>
                  <div className="text-sm">
                    {tracker.heading !== undefined
                      ? `${tracker.heading}°`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" /> Speed
                  </div>
                  <div className="text-sm">
                    {tracker.speed !== undefined
                      ? `${tracker.speed} km/h`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Status info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Last Update
                  </div>
                  <div className="text-sm">
                    {formatRelativeTime(tracker.lastUpdated)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <Battery className="h-4 w-4" /> Battery
                  </div>
                  <div className="text-sm">
                    {tracker.batteryLevel !== undefined ? (
                      <BatteryIndicator level={tracker.batteryLevel} />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <Button className="flex-1">Fair Flex History</Button>
                <Button variant="outline" className="flex-1">
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
