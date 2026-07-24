import { Slide } from "@mui/material";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { useMarkers } from "../../models/MarkerModel";
import CustomAppBar from "../AppBar";
import MapMarker from "../maps/MapMarker";
import MarkerCreator from "../maps/MarkerCreator";
import MarkerEditor from "../maps/MarkerEditor";
import MarkerList from "../maps/MarkerList";
import { useSlider } from "../sliders/hooks/useSliders";

const MapPage = () => {
  const [showMarkerDetailPoppers, setShowMarkerDetailPoppers] = useState(true);

  const { state } = useSlider();

  const { data: markers } = useMarkers({});

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CustomAppBar
        showMarkerDetailPoppers={showMarkerDetailPoppers}
        onToggleMarkerDetailPopopers={() =>
          setShowMarkerDetailPoppers((prev) => !prev)
        }
      />
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[52.52, 13.405]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers
            ?.filter((m) => m.id !== state.editMarkerSlider?.marker.id)
            .map((m) => (
              <MapMarker
                key={m.id}
                showDetailPoppers={showMarkerDetailPoppers}
                marker={m}
              />
            ))}
          <MarkerCreator />
          {state.editMarkerSlider && (
            <MarkerEditor marker={state.editMarkerSlider.marker} />
          )}
          {state.markerListSlider && (
            <Slide
              direction={
                state.markerListSlider.position === "right" ? "left" : "right"
              }
              in={!!state.markerListSlider}
              mountOnEnter
              unmountOnExit
            >
              <MarkerList position={state.markerListSlider.position} />
            </Slide>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
