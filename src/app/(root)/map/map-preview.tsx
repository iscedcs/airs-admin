"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { generateRandomLocations } from "@/lib/utils";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";

// Define the tracker interface
interface IModifiedTrackerDetails {
  lat: number;
  lon: number;
  id: string;
  name?: string;
}

interface MarkerData {
  lat: number;
  lng: number;
  id: string;
  title?: string;
}

interface Cluster {
  id: string;
  lat: number;
  lng: number;
  points: MarkerData[];
}

// Custom marker component
const VehicleMarker = ({
  position,
  title,
  onClick,
}: {
  position: { lat: number; lng: number };
  title?: string;
  onClick?: () => void;
}) => {
  return (
    <AdvancedMarker position={position} title={title || ""} onClick={onClick}>
      <div className="text-4xl">🚗</div>
    </AdvancedMarker>
  );
};

// Custom cluster marker component
const ClusterMarker = ({
  position,
  count,
  onClick,
}: {
  position: { lat: number; lng: number };
  count: number;
  onClick: () => void;
}) => {
  const size = Math.min(60, Math.max(40, 30 + count / 10));

  return (
    <AdvancedMarker position={position} onClick={onClick}>
      <div
        className="bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {count}
      </div>
    </AdvancedMarker>
  );
};

// Custom hook for clustering
function useMarkerClustering(markers: MarkerData[], radius = 60) {
  const map = useMap();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [zoom, setZoom] = useState<number>(12);

  // Update clusters when map, markers, or zoom changes
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("zoom_changed", () => {
      setZoom(map.getZoom() || 12);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  // Calculate clusters based on current zoom and markers
  useEffect(() => {
    if (!markers.length) return;

    // If zoomed in enough, don't cluster
    if (zoom >= 14) {
      const individualClusters = markers.map((marker) => ({
        id: marker.id,
        lat: marker.lat,
        lng: marker.lng,
        points: [marker],
      }));
      setClusters(individualClusters);
      return;
    }

    // Simple clustering algorithm
    const pixelsPerDegree = (Math.pow(2, zoom) * 256) / 360;
    const radiusInDeg = radius / pixelsPerDegree;

    const newClusters: Cluster[] = [];
    const processed = new Set<string>();

    markers.forEach((marker) => {
      if (processed.has(marker.id)) return;

      const cluster: Cluster = {
        id: `cluster-${newClusters.length}`,
        lat: marker.lat,
        lng: marker.lng,
        points: [marker],
      };

      processed.add(marker.id);

      // Find nearby markers to add to this cluster
      markers.forEach((otherMarker) => {
        if (processed.has(otherMarker.id)) return;

        const distance = Math.sqrt(
          Math.pow(marker.lat - otherMarker.lat, 2) +
            Math.pow(marker.lng - otherMarker.lng, 2)
        );

        if (distance <= radiusInDeg) {
          cluster.points.push(otherMarker);
          processed.add(otherMarker.id);

          // Recalculate cluster center
          cluster.lat =
            cluster.points.reduce((sum, p) => sum + p.lat, 0) /
            cluster.points.length;
          cluster.lng =
            cluster.points.reduce((sum, p) => sum + p.lng, 0) /
            cluster.points.length;
        }
      });

      newClusters.push(cluster);
    });

    setClusters(newClusters);
  }, [markers, zoom, radius]);

  // Function to handle cluster click
  const handleClusterClick = useCallback(
    (cluster: Cluster) => {
      if (!map || cluster.points.length <= 1) return;

      const bounds = new (window as any).google.maps.LatLngBounds();
      cluster.points.forEach((point) => {
        bounds.extend({ lat: point.lat, lng: point.lng });
      });

      map.fitBounds(bounds, 50);
    },
    [map]
  );

  return { clusters, handleClusterClick };
}

// Main component
export default function MapPreview({
  trackers,
}: {
  trackers?: IModifiedTrackerDetails[];
}) {
  const [apiLoaded, setApiLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Generate locations only once using useMemo
  const locationMaps = useMemo(() => generateRandomLocations(1000), []);

  // Prepare marker data
  const markerData = useMemo(() => {
    if (trackers && trackers.length > 0) {
      return trackers.map((tracker) => ({
        lat: tracker.lat,
        lng: tracker.lon,
        id: tracker.id,
        title: tracker.name || tracker.id,
      }));
    }
    return locationMaps.map((loc, index) => ({
      lat: loc.lat,
      lng: loc.lng,
      id: `random-${index}`,
      title: `Vehicle ${index + 1}`,
    }));
  }, [trackers, locationMaps]);

  // Calculate center position
  const centerPosition = useMemo(() => {
    if (markerData.length > 0) {
      return { lat: markerData[0].lat, lng: markerData[0].lng };
    }
    return { lat: 0, lng: 0 };
  }, [markerData]);

  // Handle API load error
  const handleApiLoadError = useCallback(() => {
    console.error("Google Maps API failed to load");
  }, []);

  // Handle API load success
  const handleApiLoadSuccess = useCallback(() => {
    setApiLoaded(true);
  }, []);

  // Handle map instance
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-[100svh] w-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Google Maps API key is missing</p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      //  onError={handleApiLoadError}
      onLoad={handleApiLoadSuccess}
    >
      <div className="h-[100svh] w-full relative">
        {!apiLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        <GoogleMap
          className="h-full w-full"
          zoom={12}
          center={centerPosition}
          gestureHandling="greedy"
          mapId="map-with-clusters"
          mapTypeControl={false}
          fullscreenControl={false}
          // onLoad={onMapLoad}
        >
          <MapContent markerData={markerData} />
        </GoogleMap>
      </div>
    </APIProvider>
  );
}

// Separate component to use the useMap hook
function MapContent({ markerData }: { markerData: MarkerData[] }) {
  const { clusters, handleClusterClick } = useMarkerClustering(markerData);

  return (
    <>
      {clusters.map((cluster) => {
        // If cluster has only one point, render a normal marker
        if (cluster.points.length === 1) {
          const marker = cluster.points[0];
          return (
            <VehicleMarker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title}
            />
          );
        }

        // Otherwise render a cluster marker
        return (
          <ClusterMarker
            key={cluster.id}
            position={{ lat: cluster.lat, lng: cluster.lng }}
            count={cluster.points.length}
            onClick={() => handleClusterClick(cluster)}
          />
        );
      })}
    </>
  );
}
