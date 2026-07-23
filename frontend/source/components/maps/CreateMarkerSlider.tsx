import { Slide } from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useCreateMarker } from "../../models/MarkerModel";
import { SliderPosition } from "../sliders/SliderAction";
import MarkerSlider from "./MarkerSlider";
import { IFormState } from "./types/IFormState";

interface ICreateMarkerSliderProps {
  open: boolean;
  position: SliderPosition;
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
}

const CreateMarkerSlider = (props: ICreateMarkerSliderProps) => {
  const { open, position, formState, setFormState } = props;

  const { t } = useTranslation();
  const createMarker = useCreateMarker();

  const onSubmit = useCallback(() => {
    if (formState.name === null) {
      return;
    }

    createMarker.mutate({
      name: formState.name,
      description: formState.description?.trim(),
      latitude: formState.latitude,
      longitude: formState.longitude
    });
  }, [formState, createMarker]);

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
      <MarkerSlider
        title={t("Create a new marker")}
        position={position}
        formState={formState}
        setFormState={setFormState}
        onSubmit={onSubmit}
        isSubmitting={createMarker.isPending}
      />
    </Slide>
  );
};

export default CreateMarkerSlider;
