import { Slide } from "@mui/material";
import { useMemo, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import CreateMarkerSlider from "./CreateMarkerSlider";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerCreatorProps {
  open: boolean;
  onOpen: () => void;
}

const MarkerCreator = (props: IMarkerCreatorProps) => {
  const { open, onOpen } = props;

  const [formState, setFormState] = useState<IFormState>({
    name: "",
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

      onOpen();
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
      {open && (
        <>
          <Slide direction="right" in={open} mountOnEnter unmountOnExit>
            <CreateMarkerSlider
              formState={formState}
              setFormState={setFormState}
            />
          </Slide>
          {position && <Marker position={position} />}
        </>
      )}
    </>
  );
};

export default MarkerCreator;
