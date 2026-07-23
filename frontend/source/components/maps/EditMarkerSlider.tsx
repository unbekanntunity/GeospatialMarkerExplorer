import { Slide } from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useUpdateMarker } from "../../models/MarkerModel";
import { SliderPosition } from "../sliders/SliderAction";
import MarkerSlider from "./MarkerSlider";
import { IFormState } from "./types/IFormState";

interface IEditMarkerSliderProps {
  open: boolean;
  position: SliderPosition;
  id: string;
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
}

const EditMarkerSlider = (props: IEditMarkerSliderProps) => {
  const { open, position, id, formState, setFormState } = props;

  const { t } = useTranslation();

  const updateMarker = useUpdateMarker();

  const onSubmit = useCallback(() => {
    if (formState.name === null) {
      return;
    }

    updateMarker.mutate({ id, marker: formState });
  }, [id, formState, updateMarker]);

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
      <MarkerSlider
        title={t(`Edit a Marker: ${id}`)}
        position={position}
        formState={formState}
        setFormState={setFormState}
        onSubmit={onSubmit}
        isSubmitting={updateMarker.isPending}
      />
    </Slide>
  );
};

export default EditMarkerSlider;
