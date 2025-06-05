"use client";

import type React from "react";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MapPin,
  Battery,
  RotateCw,
  ChevronRight,
  Filter,
  Navigation,
  X,
  List,
  Map,
} from "lucide-react";

// Reuse the TrackerDetails interface from single-tracker-view
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

// Status badge component (reused from single-tracker-view)
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

// Battery level indicator (reused from single-tracker-view)
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

// Format date to relative time (reused from single-tracker-view)
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

// Custom marker with status indicator
const TrackerMarker = ({
  tracker,
  isSelected,
  onClick,
}: {
  tracker: TrackerDetails;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const statusColors = {
    active: "bg-green-500",
    idle: "bg-amber-500",
    offline: "bg-gray-500",
  };

  const statusColor = statusColors[tracker.status || "offline"];

  return (
    <AdvancedMarker
      position={{ lat: tracker.lat, lng: tracker.lon }}
      onClick={onClick}
      title={tracker.name}
    >
      <div className="relative">
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute -inset-2 rounded-full border-2 border-primary animate-pulse"></div>
        )}

        {/* Marker with status indicator */}
        <div className="relative bg-white rounded-full p-1 shadow-lg">
          <div
            className={`relative rounded-full h-6 w-6 flex items-center justify-center ${statusColor}`}
          >
            {tracker.heading !== undefined ? (
              <Navigation
                className="h-4 w-4 text-white"
                style={{ transform: `rotate(${tracker.heading}deg)` }}
              />
            ) : (
              <MapPin className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
};

// Tracker list item component
function TrackerListItem({
  tracker,
  isSelected,
  onClick,
}: {
  tracker: TrackerDetails;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-blue-50 border-l-4 border-l-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{tracker.name}</div>
          <div className="text-sm text-gray-500 truncate max-w-[200px]">
            {tracker.address || "Unknown location"}
          </div>
        </div>
        <StatusBadge status={tracker.status} />
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <div className="text-gray-500">
          {formatRelativeTime(tracker.lastUpdated)}
        </div>
        {tracker.batteryLevel !== undefined && (
          <BatteryIndicator level={tracker.batteryLevel} />
        )}
      </div>

      {isSelected && (
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="ghost" className="h-8 gap-1">
            Details <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Summary stats component
function TrackerSummary({ trackers }: { trackers: TrackerDetails[] }) {
  const stats = useMemo(() => {
    const active = trackers.filter((t) => t.status === "active").length;
    const idle = trackers.filter((t) => t.status === "idle").length;
    const offline = trackers.filter((t) => t.status === "offline").length;

    return { active, idle, offline, total: trackers.length };
  }, [trackers]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
      <div className="bg-gray-100 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-xl font-bold">{stats.total}</div>
      </div>
      <div className="bg-green-50 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Active</div>
        <div className="text-xl font-bold text-green-600">{stats.active}</div>
      </div>
      <div className="bg-amber-50 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Idle</div>
        <div className="text-xl font-bold text-amber-600">{stats.idle}</div>
      </div>
      <div className="bg-gray-50 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Offline</div>
        <div className="text-xl font-bold text-gray-600">{stats.offline}</div>
      </div>
    </div>
  );
}

// Filter component
function TrackerFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: { status?: string; search?: string }) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ status, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? undefined : value;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, search });
  };

  const clearSearch = () => {
    setSearch("");
    onFilterChange({ status, search: "" });
  };

  return (
    <div className="p-3 border-b space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search fair flex..."
          value={search}
          onChange={handleSearchChange}
          className="pl-8 pr-8"
        />
        {search && (
          <button
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-1">
        <Button
          size="sm"
          variant={!status ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleStatusChange("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={status === "active" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleStatusChange("active")}
        >
          Active
        </Button>
        <Button
          size="sm"
          variant={status === "idle" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleStatusChange("idle")}
        >
          Idle
        </Button>
        <Button
          size="sm"
          variant={status === "offline" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleStatusChange("offline")}
        >
          Offline
        </Button>
      </div>
    </div>
  );
}

// Map content component
function TrackersMapContent({
  trackers,
  selectedTrackerId,
  onTrackerSelect,
}: {
  trackers: TrackerDetails[];
  selectedTrackerId?: string;
  onTrackerSelect: (trackerId: string) => void;
}) {
  const map = useMap();

  // Fit map to show all trackers when trackers change
  useEffect(() => {
    if (!map || trackers.length === 0) return;

    if (trackers.length === 1) {
      map.setCenter({ lat: trackers[0].lat, lng: trackers[0].lon });
      map.setZoom(15);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    trackers.forEach((tracker) => {
      bounds.extend({ lat: tracker.lat, lng: tracker.lon });
    });

    map.fitBounds(bounds, 50);
  }, [map, trackers]);

  // Center on selected tracker
  useEffect(() => {
    if (!map || !selectedTrackerId) return;

    const selectedTracker = trackers.find((t) => t.id === selectedTrackerId);
    if (selectedTracker) {
      map.panTo({ lat: selectedTracker.lat, lng: selectedTracker.lon });
      map.setZoom(15);
    }
  }, [map, selectedTrackerId, trackers]);

  return (
    <>
      {trackers.map((tracker) => (
        <TrackerMarker
          key={tracker.id}
          tracker={tracker}
          isSelected={tracker.id === selectedTrackerId}
          onClick={() => onTrackerSelect(tracker.id)}
        />
      ))}
    </>
  );
}

// Main component
export default function AllTrackersView() {
  const router = useRouter();
  const [trackers, setTrackers] = useState<TrackerDetails[]>([]);
  const [filteredTrackers, setFilteredTrackers] = useState<TrackerDetails[]>(
    []
  );
  const [selectedTrackerId, setSelectedTrackerId] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<"map" | "list">("map");

  // API key
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    "AIzaSyB-5fVMfpSgqz0AAGjNDIcMDDLqOIhkKhk";

  // Generate random Anambra addresses
  const getRandomAnambraAddress = useCallback(() => {
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
  }, []);

  // Fetch trackers data
  const fetchTrackersData = useCallback(async () => {
    try {
      setRefreshing(true);

      // Simulate API call - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock data - replace with actual API response
      const mockTrackers: TrackerDetails[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: `fair-flex-${i + 1}`,
          name: `Vehicle ${i + 1}`,
          lat: 6.2 + (Math.random() - 0.5) * 0.1, // Centered around Anambra State
          lon: 7.0 + (Math.random() - 0.5) * 0.1, // Centered around Anambra State
          speed: Math.floor(Math.random() * 80),
          heading: Math.floor(Math.random() * 360),
          lastUpdated: new Date(
            Date.now() - Math.floor(Math.random() * 3600000)
          ).toISOString(),
          batteryLevel: Math.floor(Math.random() * 100),
          status:
            Math.random() > 0.2
              ? "active"
              : Math.random() > 0.5
              ? "idle"
              : "offline",
          address: getRandomAnambraAddress(),
        })
      );

      setTrackers(mockTrackers);
      setFilteredTrackers(mockTrackers);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch trackers data");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [getRandomAnambraAddress]);

  // Initial data fetch
  useEffect(() => {
    fetchTrackersData();
  }, [fetchTrackersData]);

  // Auto-refresh every 60 seconds
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       fetchTrackersData();
  //     }, 60000);

  //     return () => clearInterval(interval);
  //   }, [fetchTrackersData]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchTrackersData();
  }, [fetchTrackersData]);

  // Handle filter change
  const handleFilterChange = useCallback(
    ({ status, search }: { status?: string; search?: string }) => {
      let filtered = [...trackers];

      if (status) {
        filtered = filtered.filter((tracker) => tracker.status === status);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (tracker) =>
            tracker.name.toLowerCase().includes(searchLower) ||
            (tracker.address &&
              tracker.address.toLowerCase().includes(searchLower))
        );
      }

      setFilteredTrackers(filtered);
    },
    [trackers]
  );

  // Handle tracker selection
  const handleTrackerSelect = useCallback((trackerId: string) => {
    setSelectedTrackerId(trackerId);
  }, []);

  // Handle view tracker details
  const handleViewTrackerDetails = useCallback(() => {
    if (selectedTrackerId) {
      router.push(`/map/${selectedTrackerId}`);
    }
  }, [router, selectedTrackerId]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Map options
  const mapOptions = useMemo(
    () => ({
      mapId: "all-trackers-map",
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
    <div className="h-[calc(100svh-100px)] w-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">All Fair Flex</h1>
        <div className="flex gap-2">
          <div className="md:hidden">
            <Tabs
              value={activeView}
              onValueChange={(v) => setActiveView(v as "map" | "list")}
            >
              <TabsList>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-1" /> Map
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-1" /> List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RotateCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden flex-1 overflow-hidden">
        <Tabs value={activeView} className="h-full">
          <TabsContent value="map" className="h-full m-0 p-0">
            <APIProvider apiKey={apiKey}>
              <GoogleMap
                className="h-full w-full"
                zoom={12}
                center={{ lat: 6.2, lng: 7.0 }}
                {...mapOptions}
              >
                <TrackersMapContent
                  trackers={filteredTrackers}
                  selectedTrackerId={selectedTrackerId}
                  onTrackerSelect={handleTrackerSelect}
                />
              </GoogleMap>
            </APIProvider>
          </TabsContent>
          <TabsContent value="list" className="h-full m-0 p-0 overflow-auto">
            <Card className="border-0 rounded-none h-full">
              <CardContent className="p-0">
                <TrackerFilters onFilterChange={handleFilterChange} />
                <TrackerSummary trackers={filteredTrackers} />
                <div className="divide-y">
                  {filteredTrackers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No fair flex found matching your filters
                    </div>
                  ) : (
                    filteredTrackers.map((tracker) => (
                      <TrackerListItem
                        key={tracker.id}
                        tracker={tracker}
                        isSelected={tracker.id === selectedTrackerId}
                        onClick={() => {
                          handleTrackerSelect(tracker.id);
                          router.push(`/map/${tracker.id}`);
                        }}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-r overflow-auto">
            <Card className="border-0 rounded-none h-full">
              <CardContent className="p-0">
                <TrackerFilters onFilterChange={handleFilterChange} />
                <TrackerSummary trackers={filteredTrackers} />
                <div className="divide-y">
                  {filteredTrackers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No fair flex found matching your filters
                    </div>
                  ) : (
                    filteredTrackers.map((tracker) => (
                      <TrackerListItem
                        key={tracker.id}
                        tracker={tracker}
                        isSelected={tracker.id === selectedTrackerId}
                        onClick={() => handleTrackerSelect(tracker.id)}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              className="h-full w-full"
              zoom={12}
              center={{ lat: 6.2, lng: 7.0 }}
              {...mapOptions}
            >
              <TrackersMapContent
                trackers={filteredTrackers}
                selectedTrackerId={selectedTrackerId}
                onTrackerSelect={handleTrackerSelect}
              />
            </GoogleMap>
          </APIProvider>

          {/* Selected tracker info overlay */}
          {selectedTrackerId && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72">
              <Card className="shadow-lg">
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">
                      {trackers.find((t) => t.id === selectedTrackerId)?.name}
                    </CardTitle>
                    <StatusBadge
                      status={
                        trackers.find((t) => t.id === selectedTrackerId)?.status
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    {trackers.find((t) => t.id === selectedTrackerId)?.address}
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <div>
                      Last updated:{" "}
                      {formatRelativeTime(
                        trackers.find((t) => t.id === selectedTrackerId)
                          ?.lastUpdated
                      )}
                    </div>
                    <div>
                      {trackers.find((t) => t.id === selectedTrackerId)?.speed}{" "}
                      km/h
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={handleViewTrackerDetails}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
