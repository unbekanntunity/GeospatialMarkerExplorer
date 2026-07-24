import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useUpdateMarker } from "../../models/MarkerModel";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
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

  const { dispatch } = useSlider();
  const { t } = useTranslation();

  const updateMarker = useUpdateMarker();

  const onSubmit = useCallback(() => {
    if (formState.name === null) {
      return;
    }

    updateMarker.mutate({ id, marker: formState });
  }, [id, formState, updateMarker]);

  const onClose = useCallback(() => {
    dispatch({
      type: SliderAction.HideSlider,
      slider: "editMarkerSlider"
    });
  }, [dispatch]);

  return (
    <MarkerSlider
      open={open}
      title={`${t("editMarkerSlider.title")} ${id}`}
      submitText={t("editMarkerSlider.submit")}
      position={position}
      formState={formState}
      setFormState={setFormState}
      onSubmit={onSubmit}
      isSubmitting={updateMarker.isPending}
      onClose={onClose}
    />
  );
};

export default EditMarkerSlider;
