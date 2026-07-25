import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useCreateMarker } from "../../models/MarkerModel";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import MarkerSlider from "./MarkerSlider";
import { defaultFormState, IFormState } from "./types/IFormState";

interface ICreateMarkerSliderProps {
  open: boolean;
  position: SliderPosition;
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
}

const CreateMarkerSlider = (props: ICreateMarkerSliderProps) => {
  const { open, position, formState, setFormState } = props;

  const { dispatch } = useSlider();
  const { t } = useTranslation();

  const createMarker = useCreateMarker();

  const onClose = useCallback(() => {
    setFormState(defaultFormState);

    dispatch({
      type: SliderAction.HideSlider,
      slider: "createMarkerSlider"
    });
  }, [setFormState, dispatch]);

  const onSubmit = useCallback(async () => {
    if (formState.name === null) {
      return;
    }

    await createMarker.mutateAsync({
      name: formState.name,
      description: formState.description?.trim(),
      latitude: formState.latitude,
      longitude: formState.longitude
    });

    onClose();
  }, [formState, createMarker, onClose]);
  return (
    <MarkerSlider
      open={open}
      title={t("createMarkerSlider.title")}
      submitText={t("createMarkerSlider.submit")}
      position={position}
      formState={formState}
      setFormState={setFormState}
      onSubmit={onSubmit}
      isSubmitting={createMarker.isPending}
      onClose={onClose}
    />
  );
};

export default CreateMarkerSlider;
