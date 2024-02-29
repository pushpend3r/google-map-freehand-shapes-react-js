import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { ElementRef, useEffect, useRef } from "react";

type Polyline = google.maps.Polyline;

interface MapProps {
  width?: string;
  height?: string;
  onShapeDraw?: (polygon: Polyline) => void;
}

const AppMap = ({
  width = "100vw",
  height = "100vh",
  onShapeDraw,
}: MapProps) => {
  const coreLibrary = useMapsLibrary("core");
  const mapsLibrary = useMapsLibrary("maps");
  const mapInstance = useMap();

  const mapContainerRef = useRef<ElementRef<"div"> | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const polylineRef = useRef<Polyline | null>(null);

  const mapContainer = mapContainerRef.current;

  const triggerMouseMoveEventOnMap = () => {
    if (!coreLibrary || !mapInstance) return;
    coreLibrary.event.trigger(mapInstance, "mousemove");
  };

  const handleMouseDownListener = () => {
    polylineRef.current = new mapsLibrary!.Polyline({
      strokeColor: "#005DA4",
      strokeOpacity: 1,
      strokeWeight: 3,
    });
    polylineRef.current.setMap(mapInstance);
    isMouseDownRef.current = true;
  };

  const handleMouseUpListener = () => {
    const path = polylineRef.current!.getPath().getArray();
    path.push(polylineRef.current!.getPath().getArray()[0]);
    polylineRef.current?.setPath(path);
    onShapeDraw?.(polylineRef.current!);
    isMouseDownRef.current = false;
  };

  useEffect(() => {
    if (!mapInstance || !coreLibrary || !mapContainer) return;

    mapInstance.setOptions({
      // To disable dragging
      gestureHandling: "none",
    });

    const handleMapMouseMoveListener = (e: google.maps.MapMouseEvent) => {
      if (!isMouseDownRef.current || !e) {
        return;
      }
      const path = polylineRef.current!.getPath().getArray();
      path.push(e.latLng!);
      polylineRef.current!.setPath(path);
    };

    mapContainer.addEventListener("mousedown", handleMouseDownListener);
    mapContainer.addEventListener("mouseup", handleMouseUpListener);

    mapContainer.addEventListener("touchmove", triggerMouseMoveEventOnMap);
    mapContainer.addEventListener("touchstart", handleMouseDownListener);
    mapContainer.addEventListener("touchend", handleMouseUpListener);

    coreLibrary.event.addListener(
      mapInstance,
      "mousemove",
      handleMapMouseMoveListener
    );

    return () => {
      coreLibrary.event.clearListeners(mapInstance, "mousemove");
      mapContainer.removeEventListener("mousedown", handleMouseDownListener);
      mapContainer.removeEventListener("mouseup", handleMouseUpListener);

      mapContainer.removeEventListener("touchmove", triggerMouseMoveEventOnMap);
      mapContainer.removeEventListener("touchstart", handleMouseDownListener);
      mapContainer.removeEventListener("touchend", handleMouseUpListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance, coreLibrary, mapContainer]);

  return (
    <div style={{ width, height }} ref={mapContainerRef}>
      <Map defaultCenter={{ lat: 22.54992, lng: 0 }} defaultZoom={3}></Map>
    </div>
  );
};

export default AppMap;
