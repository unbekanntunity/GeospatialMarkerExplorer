import { useTheme } from "@mui/material";
import { DragEndEvent } from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { CircleMarker, Marker, useMapEvents } from "react-leaflet";

import { MarkerResponse } from "../../api/generated";
import { useSlider } from "../sliders/hooks/useSliders";
import EditMarkerSlider from "./EditMarkerSlider";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerEditorProps {
  marker: MarkerResponse;
}

const MarkerEditor = (props: IMarkerEditorProps) => {
  const { marker } = props;

  const theme = useTheme();
  const { state } = useSlider();

  const [formState, setFormState] = useState<IFormState>({
    name: marker.name,
    description: marker.description,
    latitude: marker.latitude,
    longitude: marker.longitude
  });

  useMapEvents({
    click(e) {
      setFormState((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));
    }
  });

  const position = useMemo(() => {
    return convertToCoordinate(
      formState.latitude.toString(),
      formState.longitude.toString()
    );
  }, [formState.latitude, formState.longitude]);

  const onDragEnd = useCallback((e: DragEndEvent) => {
    const markerObject = e.target;
    const position = markerObject.getLatLng();

    setFormState((prev) => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng
    }));
  }, []);

  return (
    <>
      {state.editMarkerSlider && (
        <>
          <EditMarkerSlider
            open={!!state.editMarkerSlider}
            position={state.editMarkerSlider.position}
            id={marker.id}
            formState={formState}
            setFormState={setFormState}
          />
          {position && (
            <>
              <CircleMarker
                center={position}
                radius={14}
                pathOptions={{
                  color: theme.palette.error.main,
                  weight: 3,
                  fillOpacity: 0.15
                }}
              />
              <Marker
                draggable
                eventHandlers={{
                  dragend: onDragEnd
                }}
                position={position}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default MarkerEditor;
