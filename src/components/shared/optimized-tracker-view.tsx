"use client";

import type React from "react";

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useTransition,
} from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Battery,
  RotateCw,
  Navigation,
  X,
  List,
  Map,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

// Tracker interface
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

// Cluster interface
interface Cluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  points: TrackerDetails[];
}

// Status badge component
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

// Format date to relative time
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

// Custom cluster marker component
const ClusterMarker = ({
  cluster,
  onClick,
}: {
  cluster: Cluster;
  onClick: () => void;
}) => {
  // Determine color based on status composition
  const getClusterColor = () => {
    const activeCount = cluster.points.filter(
      (t) => t.status === "active"
    ).length;
    const idleCount = cluster.points.filter((t) => t.status === "idle").length;

    if (activeCount > cluster.count * 0.6) return "bg-green-500";
    if (idleCount > cluster.count * 0.6) return "bg-amber-500";
    if (activeCount + idleCount > cluster.count * 0.6) return "bg-blue-500";
    return "bg-gray-500";
  };

  const color = getClusterColor();
  const size = Math.min(70, Math.max(40, 30 + Math.log10(cluster.count) * 10));

  return (
    <AdvancedMarker
      position={{ lat: cluster.lat, lng: cluster.lng }}
      onClick={onClick}
    >
      <div
        className={`${color} text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {cluster.count}
      </div>
    </AdvancedMarker>
  );
};

// Custom tracker marker component
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
        {isSelected && (
          <div className="absolute -inset-2 rounded-full border-2 border-primary animate-pulse"></div>
        )}
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

// Virtualized tracker list component
function VirtualizedTrackerList({
  trackers,
  selectedTrackerId,
  onSelect,
}: {
  trackers: TrackerDetails[];
  selectedTrackerId?: string;
  onSelect: (id: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: trackers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="overflow-auto h-full">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const tracker = trackers[virtualRow.index];
          const isSelected = tracker.id === selectedTrackerId;

          return (
            <div
              key={virtualRow.key.toString()}
              className={`absolute top-0 left-0 w-full border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-blue-50 border-l-4 border-l-primary" : ""
              }`}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              onClick={() => onSelect(tracker.id)}
            >
              <div className="p-3">
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
                    <div className="flex items-center gap-1">
                      <Battery
                        className={
                          tracker.batteryLevel > 70
                            ? "text-green-500"
                            : tracker.batteryLevel > 30
                            ? "text-amber-500"
                            : "text-red-500"
                        }
                      />
                      <span>{tracker.batteryLevel}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Map content component with clustering
function OptimizedMapContent({
  trackers,
  selectedTrackerId,
  onTrackerSelect,
  clusteringRadius,
  maxMarkersToRender,
}: {
  trackers: TrackerDetails[];
  selectedTrackerId?: string;
  onTrackerSelect: (trackerId: string) => void;
  clusteringRadius: number;
  maxMarkersToRender: number;
}) {
  const map = useMap();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [visibleTrackers, setVisibleTrackers] = useState<TrackerDetails[]>([]);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [zoom, setZoom] = useState<number>(12);
  const [isPending, startTransition] = useTransition();

  // Declare google variable
  const google = (window as any).google;

  // Update zoom level when it changes
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("zoom_changed", () => {
      setZoom(map.getZoom() || 12);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, google]);

  // Update bounds when map moves
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("idle", () => {
      setBounds(map.getBounds() || null);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, google]);

  // Filter trackers to only those in the current viewport
  useEffect(() => {
    if (!bounds) return;

    startTransition(() => {
      const inBounds = trackers.filter((tracker) => {
        return bounds.contains({ lat: tracker.lat, lng: tracker.lon });
      });

      // Limit the number of markers to render for performance
      const limitedTrackers = inBounds.slice(0, maxMarkersToRender);
      setVisibleTrackers(limitedTrackers);
    });
  }, [bounds, trackers, maxMarkersToRender]);

  // Create clusters from visible trackers
  useEffect(() => {
    if (!visibleTrackers.length) return;

    startTransition(() => {
      // If zoomed in enough, don't cluster
      if (zoom >= 16) {
        const individualClusters: Cluster[] = visibleTrackers.map(
          (tracker) => ({
            id: tracker.id,
            lat: tracker.lat,
            lng: tracker.lon,
            count: 1,
            bounds: {
              north: tracker.lat + 0.0001,
              south: tracker.lat - 0.0001,
              east: tracker.lon + 0.0001,
              west: tracker.lon - 0.0001,
            },
            points: [tracker],
          })
        );
        setClusters(individualClusters);
        return;
      }

      // Calculate clustering radius based on zoom level
      const pixelsPerDegree = (Math.pow(2, zoom) * 256) / 360;
      const radiusInDeg = clusteringRadius / pixelsPerDegree;

      const newClusters: Cluster[] = [];
      const processed = new Set<string>();

      visibleTrackers.forEach((tracker) => {
        if (processed.has(tracker.id)) return;

        const cluster: Cluster = {
          id: `cluster-${newClusters.length}`,
          lat: tracker.lat,
          lng: tracker.lon,
          count: 1,
          bounds: {
            north: tracker.lat,
            south: tracker.lat,
            east: tracker.lon,
            west: tracker.lon,
          },
          points: [tracker],
        };

        processed.add(tracker.id);

        // Find nearby trackers to add to this cluster
        visibleTrackers.forEach((otherTracker) => {
          if (processed.has(otherTracker.id)) return;

          const distance = Math.sqrt(
            Math.pow(tracker.lat - otherTracker.lat, 2) +
              Math.pow(tracker.lon - otherTracker.lon, 2)
          );

          if (distance <= radiusInDeg) {
            cluster.points.push(otherTracker);
            processed.add(otherTracker.id);

            // Update cluster center
            cluster.lat =
              cluster.points.reduce((sum, p) => sum + p.lat, 0) /
              cluster.points.length;
            cluster.lng =
              cluster.points.reduce((sum, p) => sum + p.lon, 0) /
              cluster.points.length;

            // Update cluster bounds
            cluster.bounds.north = Math.max(
              cluster.bounds.north,
              otherTracker.lat
            );
            cluster.bounds.south = Math.min(
              cluster.bounds.south,
              otherTracker.lat
            );
            cluster.bounds.east = Math.max(
              cluster.bounds.east,
              otherTracker.lon
            );
            cluster.bounds.west = Math.min(
              cluster.bounds.west,
              otherTracker.lon
            );
          }
        });

        cluster.count = cluster.points.length;
        newClusters.push(cluster);
      });

      setClusters(newClusters);
    });
  }, [visibleTrackers, zoom, clusteringRadius, google]);

  // Handle cluster click
  const handleClusterClick = useCallback(
    (cluster: Cluster) => {
      if (!map || cluster.count <= 1) return;

      const bounds = new google.maps.LatLngBounds(
        { lat: cluster.bounds.south, lng: cluster.bounds.west },
        { lat: cluster.bounds.north, lng: cluster.bounds.east }
      );

      map.fitBounds(bounds, 50);

      // If cluster has only a few points and we're zoomed in enough, select the first one
      if (cluster.count <= 5 && zoom >= 14) {
        onTrackerSelect(cluster.points[0].id);
      }
    },
    [map, zoom, onTrackerSelect, google]
  );

  // Center on selected tracker
  useEffect(() => {
    if (!map || !selectedTrackerId) return;

    const selectedTracker = trackers.find((t) => t.id === selectedTrackerId);
    if (selectedTracker) {
      map.panTo({ lat: selectedTracker.lat, lng: selectedTracker.lon });
      if (zoom < 15) map.setZoom(15);
    }
  }, [map, selectedTrackerId, trackers, zoom]);

  // Fit map to show all trackers initially
  useEffect(() => {
    if (!map || !trackers.length) return;

    // Only do this once when trackers are first loaded
    const bounds = new google.maps.LatLngBounds();

    // Use a sample of trackers to avoid performance issues with large datasets
    const sampleSize = Math.min(trackers.length, 1000);
    const step = Math.max(1, Math.floor(trackers.length / sampleSize));

    for (let i = 0; i < trackers.length; i += step) {
      bounds.extend({ lat: trackers[i].lat, lng: trackers[i].lon });
    }

    map.fitBounds(bounds, 50);
  }, [map, trackers, google]);

  return (
    <>
      {isPending && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Updating map...</span>
        </div>
      )}

      {clusters.map((cluster) => {
        // If cluster has only one point, render a normal marker
        if (cluster.count === 1) {
          const tracker = cluster.points[0];
          return (
            <TrackerMarker
              key={tracker.id}
              tracker={tracker}
              isSelected={tracker.id === selectedTrackerId}
              onClick={() => onTrackerSelect(tracker.id)}
            />
          );
        }

        // Otherwise render a cluster marker
        return (
          <ClusterMarker
            key={cluster.id}
            cluster={cluster}
            onClick={() => handleClusterClick(cluster)}
          />
        );
      })}

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full shadow-md"
          onClick={() => map?.setZoom((map.getZoom() || 12) + 1)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full shadow-md"
          onClick={() => map?.setZoom((map.getZoom() || 12) - 1)}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

// Summary stats component
function TrackerSummary({
  trackers,
  totalTrackers,
}: {
  trackers: TrackerDetails[];
  totalTrackers: number;
}) {
  const stats = useMemo(() => {
    const active = trackers.filter((t) => t.status === "active").length;
    const idle = trackers.filter((t) => t.status === "idle").length;
    const offline = trackers.filter((t) => t.status === "offline").length;

    // Calculate percentages for the total dataset
    const activePercent = Math.round((active / trackers.length) * 100);
    const idlePercent = Math.round((idle / trackers.length) * 100);
    const offlinePercent = Math.round((offline / trackers.length) * 100);

    return {
      active,
      idle,
      offline,
      filtered: trackers.length,
      total: totalTrackers,
      activePercent,
      idlePercent,
      offlinePercent,
    };
  }, [trackers, totalTrackers]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
      <div className="bg-gray-100 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-xl font-bold">
          {stats.filtered.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">
          of {stats.total.toLocaleString()}
        </div>
      </div>
      <div className="bg-green-50 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Active</div>
        <div className="text-xl font-bold text-green-600">
          {stats.active.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">{stats.activePercent}%</div>
      </div>
      <div className="bg-amber-50 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Idle</div>
        <div className="text-xl font-bold text-amber-600">
          {stats.idle.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">{stats.idlePercent}%</div>
      </div>
      <div className="bg-gray-50 rounded p-2 text-center">
        <div className="text-sm text-gray-500">Offline</div>
        <div className="text-xl font-bold text-gray-600">
          {stats.offline.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">{stats.offlinePercent}%</div>
      </div>
    </div>
  );
}

// Advanced filter component
function AdvancedFilters({
  onFilterChange,
  clusteringRadius,
  setClusteringRadius,
  maxMarkersToRender,
  setMaxMarkersToRender,
}: {
  onFilterChange: (filters: {
    status?: string;
    search?: string;
    region?: string;
  }) => void;
  clusteringRadius: number;
  setClusteringRadius: (radius: number) => void;
  maxMarkersToRender: number;
  setMaxMarkersToRender: (max: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ status, search: e.target.value, region });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? undefined : value;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, search, region });
  };

  const handleRegionChange = (value: string) => {
    const newRegion = value === "all" ? undefined : value;
    setRegion(newRegion);
    onFilterChange({ status, search, region: newRegion });
  };

  const clearSearch = () => {
    setSearch("");
    onFilterChange({ status, search: "", region });
  };

  return (
    <div className="p-3 border-b space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search trackers..."
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

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs"
        >
          {showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}
        </Button>

        <Select value={region || "all"} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="awka">Awka</SelectItem>
            <SelectItem value="onitsha">Onitsha</SelectItem>
            <SelectItem value="nnewi">Nnewi</SelectItem>
            <SelectItem value="ekwulobia">Ekwulobia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showAdvanced && (
        <div className="space-y-3 pt-2 border-t">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm">Clustering Radius</label>
              <span className="text-xs text-gray-500">
                {clusteringRadius}px
              </span>
            </div>
            <Slider
              value={[clusteringRadius]}
              min={30}
              max={200}
              step={10}
              onValueChange={(value) => setClusteringRadius(value[0])}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm">Max Markers</label>
              <span className="text-xs text-gray-500">
                {maxMarkersToRender.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[maxMarkersToRender]}
              min={100}
              max={5000}
              step={100}
              onValueChange={(value) => setMaxMarkersToRender(value[0])}
            />
          </div>

          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-xs">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <p>Higher values may affect performance</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component
export default function OptimizedTrackersView() {
  const router = useRouter();
  const [allTrackers, setAllTrackers] = useState<TrackerDetails[]>([]);
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
  const [clusteringRadius, setClusteringRadius] = useState<number>(60);
  const [maxMarkersToRender, setMaxMarkersToRender] = useState<number>(1000);
  const [isPending, startTransition] = useTransition();

  // API key
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    "AIzaSyB-5fVMfpSgqz0AAGjNDIcMDDLqOIhkKhk";

  // Generate random Anambra addresses
  const getRandomAnambraAddress = useCallback(() => {
    const regions = ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Ihiala"];
    const region = regions[Math.floor(Math.random() * regions.length)];

    const locations = [
      `${region} Main Market, Anambra State`,
      `${region} Bus Terminal, Anambra State`,
      `${region} City Center, Anambra State`,
      `${region} Industrial Area, Anambra State`,
      `${region} Residential Zone, Anambra State`,
    ];

    return locations[Math.floor(Math.random() * locations.length)];
  }, []);

  // Generate a large number of mock trackers
  const generateMockTrackers = useCallback(
    (count: number) => {
      // Center around Anambra State
      const centerLat = 6.2;
      const centerLng = 7.0;

      // Create trackers in batches to avoid blocking the main thread
      const batchSize = 10000;
      const trackers: TrackerDetails[] = [];

      for (let i = 0; i < count; i += batchSize) {
        const batchCount = Math.min(batchSize, count - i);
        const batch = Array.from({ length: batchCount }, (_, j) => {
          const id = `fair-flex-${i + j + 1}`;
          const region =
            Math.random() > 0.7
              ? "awka"
              : Math.random() > 0.6
              ? "onitsha"
              : Math.random() > 0.5
              ? "nnewi"
              : Math.random() > 0.4
              ? "ekwulobia"
              : "ihiala";

          // Adjust coordinates based on region to create clusters
          let latOffset = (Math.random() - 0.5) * 0.1;
          let lngOffset = (Math.random() - 0.5) * 0.1;

          if (region === "awka") {
            latOffset += 0.05;
            lngOffset += 0.05;
          } else if (region === "onitsha") {
            latOffset -= 0.05;
            lngOffset += 0.05;
          } else if (region === "nnewi") {
            latOffset += 0.05;
            lngOffset -= 0.05;
          } else if (region === "ekwulobia") {
            latOffset -= 0.05;
            lngOffset -= 0.05;
          }

          return {
            id,
            name: `Vehicle ${i + j + 1}`,
            lat: centerLat + latOffset,
            lon: centerLng + lngOffset,
            speed: Math.floor(Math.random() * 80),
            heading: Math.floor(Math.random() * 360),
            lastUpdated: new Date(
              Date.now() - Math.floor(Math.random() * 3600000 * 24)
            ).toISOString(),
            batteryLevel: Math.floor(Math.random() * 100),
            status:
              Math.random() > 0.2
                ? "active"
                : Math.random() > 0.5
                ? "idle"
                : "offline",
            address: getRandomAnambraAddress(),
          };
        });

        trackers.push(
          ...batch.map((tracker) => ({
            ...tracker,
            status: tracker.status as "active" | "idle" | "offline" | undefined,
          }))
        );
      }

      return trackers;
    },
    [getRandomAnambraAddress]
  );

  // Fetch trackers data
  const fetchTrackersData = useCallback(async () => {
    try {
      setRefreshing(true);

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock data - in a real app, this would be an API call
      const mockTrackers = generateMockTrackers(100000);

      setAllTrackers(mockTrackers);

      // Initially filter to a manageable number for the list view
      startTransition(() => {
        setFilteredTrackers(mockTrackers.slice(0, 1000));
      });

      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch fair flex data");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [generateMockTrackers]);

  // Initial data fetch
  useEffect(() => {
    fetchTrackersData();
  }, [fetchTrackersData]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchTrackersData();
  }, [fetchTrackersData]);

  // Handle filter change
  const handleFilterChange = useCallback(
    ({
      status,
      search,
      region,
    }: {
      status?: string;
      search?: string;
      region?: string;
    }) => {
      startTransition(() => {
        let filtered = [...allTrackers];

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

        if (region) {
          filtered = filtered.filter(
            (tracker) =>
              tracker.address &&
              tracker.address.toLowerCase().includes(region.toLowerCase())
          );
        }

        // Limit the number of trackers for the list view
        setFilteredTrackers(filtered.slice(0, 5000));
      });
    },
    [allTrackers]
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
      mapId: "all-fair-flex-map",
      disableDefaultUI: false,
      zoomControl: false, // We'll add our own zoom controls
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    }),
    []
  );

  if (!apiKey) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Google Maps API key is missing</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading 100,000 trackers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
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
        <h1 className="text-xl font-bold">
          All Vehicles ({allTrackers.length.toLocaleString()})
        </h1>
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
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading indicator for transitions */}
      {isPending && (
        <div className="absolute top-16 left-0 right-0 h-1 z-50">
          <div className="h-full bg-primary animate-pulse"></div>
        </div>
      )}

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
                <OptimizedMapContent
                  trackers={allTrackers}
                  selectedTrackerId={selectedTrackerId}
                  onTrackerSelect={handleTrackerSelect}
                  clusteringRadius={clusteringRadius}
                  maxMarkersToRender={maxMarkersToRender}
                />
              </GoogleMap>
            </APIProvider>
          </TabsContent>
          <TabsContent value="list" className="h-full m-0 p-0 overflow-auto">
            <Card className="border-0 rounded-none h-full">
              <CardContent className="p-0">
                <AdvancedFilters
                  onFilterChange={handleFilterChange}
                  clusteringRadius={clusteringRadius}
                  setClusteringRadius={setClusteringRadius}
                  maxMarkersToRender={maxMarkersToRender}
                  setMaxMarkersToRender={setMaxMarkersToRender}
                />
                <TrackerSummary
                  trackers={filteredTrackers}
                  totalTrackers={allTrackers.length}
                />
                {filteredTrackers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No fair flex found matching your filters
                  </div>
                ) : (
                  <VirtualizedTrackerList
                    trackers={filteredTrackers}
                    selectedTrackerId={selectedTrackerId}
                    onSelect={(id) => {
                      handleTrackerSelect(id);
                      router.push(`/map/${id}`);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-r overflow-hidden flex flex-col">
            <Card className="border-0 rounded-none flex-1 flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <AdvancedFilters
                  onFilterChange={handleFilterChange}
                  clusteringRadius={clusteringRadius}
                  setClusteringRadius={setClusteringRadius}
                  maxMarkersToRender={maxMarkersToRender}
                  setMaxMarkersToRender={setMaxMarkersToRender}
                />
                <TrackerSummary
                  trackers={filteredTrackers}
                  totalTrackers={allTrackers.length}
                />
                {filteredTrackers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 flex-1">
                    No fair flex found matching your filters
                  </div>
                ) : (
                  <div className="flex-1">
                    <VirtualizedTrackerList
                      trackers={filteredTrackers}
                      selectedTrackerId={selectedTrackerId}
                      onSelect={handleTrackerSelect}
                    />
                  </div>
                )}
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
              <OptimizedMapContent
                trackers={allTrackers}
                selectedTrackerId={selectedTrackerId}
                onTrackerSelect={handleTrackerSelect}
                clusteringRadius={clusteringRadius}
                maxMarkersToRender={maxMarkersToRender}
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
                      {
                        allTrackers.find((t) => t.id === selectedTrackerId)
                          ?.name
                      }
                    </CardTitle>
                    <StatusBadge
                      status={
                        allTrackers.find((t) => t.id === selectedTrackerId)
                          ?.status
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    {
                      allTrackers.find((t) => t.id === selectedTrackerId)
                        ?.address
                    }
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <div>
                      Last updated:{" "}
                      {formatRelativeTime(
                        allTrackers.find((t) => t.id === selectedTrackerId)
                          ?.lastUpdated
                      )}
                    </div>
                    <div>
                      {
                        allTrackers.find((t) => t.id === selectedTrackerId)
                          ?.speed
                      }{" "}
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
