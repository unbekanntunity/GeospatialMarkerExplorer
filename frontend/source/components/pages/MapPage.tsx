import { Slide } from "@mui/material";
import { DragEndEvent } from "leaflet";
import { useCallback } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { MarkerResponse } from "../../api/generated";
import { useMarkers } from "../../models/MarkerModel";
import CustomAppBar from "../AppBar";
import MarkerCreator from "../maps/MarkerCreator";
import MarkerEditor from "../maps/MarkerEditor";
import MarkerList from "../maps/MarkerList";
import { convertToCoordinate } from "../maps/utils/CoordinationUtils";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";

const MapPage = () => {
  const { state, dispatch } = useSlider();

  const { data: markers } = useMarkers({});

  const onDragEnd = useCallback(
    (e: DragEndEvent, marker: MarkerResponse) => {
      const markerObject = e.target;
      const position = markerObject.getLatLng();

      const updatedMarker: MarkerResponse = {
        ...marker,
        latitude: position.lat,
        longitude: position.lng
      };

      dispatch({
        type: SliderAction.ShowSlider,
        slider: "editMarkerSlider",
        payload: {
          marker: updatedMarker,
          position: "left"
        }
      });
    },
    [dispatch]
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CustomAppBar />
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
            .map((m) => {
              const coordinates = convertToCoordinate(
                m.latitude.toString(),
                m.longitude.toString()
              );

              return coordinates ? (
                <Marker
                  key={m.id}
                  draggable
                  eventHandlers={{
                    dragend: (e) => onDragEnd(e, m)
                  }}
                  position={coordinates}
                />
              ) : null;
            })}
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
