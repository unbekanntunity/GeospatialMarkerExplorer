import { useMemo, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";
import CreateMarkerSlider from "./CreateMarkerSlider";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

const MarkerCreator = () => {
  const { state, dispatch } = useSlider();

  const [formState, setFormState] = useState<IFormState>({
    name: "",
    description: "",
    latitude: 0,
    longitude: 0
  });

  useMapEvents({
    click(e) {
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

  return (
    <>
      {state.createMarkerSlider && (
        <>
          <CreateMarkerSlider
            open={!!state.createMarkerSlider}
            position={state.createMarkerSlider.position}
            formState={formState}
            setFormState={setFormState}
          />
          {position && <Marker position={position} />}
        </>
      )}
    </>
  );
};

export default MarkerCreator;
