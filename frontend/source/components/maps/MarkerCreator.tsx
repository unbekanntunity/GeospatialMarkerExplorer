import { useTheme } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { CircleMarker, Marker, useMapEvents } from "react-leaflet";

import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";
import CreateMarkerSlider from "./CreateMarkerSlider";
import { defaultFormState, IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerCreatorProps {
  onClose: () => void;
}

const MarkerCreator = (props: IMarkerCreatorProps) => {
  const { onClose: onParentClose } = props;

  const { state, dispatch } = useSlider();
  const theme = useTheme();

  const [formState, setFormState] = useState<IFormState>(defaultFormState);

  useMapEvents({
    click(e) {
      const target = e.originalEvent.target as HTMLElement;
      if (!target.className.includes("leaflet-container")) {
        return;
      }

      setFormState((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));

      dispatch({
        type: SliderAction.ShowSlider,
        slider: "createMarkerSlider",
        payload: {
          position: "left"
        }
      });
    }
  });

  const position = useMemo(() => {
    return convertToCoordinate(
      formState.latitude.toString(),
      formState.longitude.toString()
    );
  }, [formState.latitude, formState.longitude]);

  const onClose = useCallback(() => {
    setFormState(defaultFormState);

    onParentClose();
  }, [setFormState, onParentClose]);

  return state.createMarkerSlider ? (
    <>
      <CreateMarkerSlider
        open={!!state.createMarkerSlider}
        position={state.createMarkerSlider.position}
        formState={formState}
        setFormState={setFormState}
        onClose={onClose}
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
          <Marker position={position} />
        </>
      )}
    </>
  ) : null;
};

export default MarkerCreator;
