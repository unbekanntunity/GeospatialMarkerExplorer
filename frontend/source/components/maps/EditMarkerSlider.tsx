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
  onClose: () => void;
}

const EditMarkerSlider = (props: IEditMarkerSliderProps) => {
  const { open, position, id, formState, setFormState, onClose } = props;

  const { t } = useTranslation();

  const updateMarker = useUpdateMarker();

  const onSubmit = useCallback(() => {
    if (formState.name === null) {
      return;
    }

    updateMarker.mutate({ id, marker: formState });
  }, [id, formState, updateMarker]);

  return (
    <MarkerSlider
      errorMessage={
        updateMarker.error
          ? t(`marker.error.${updateMarker.error?.name}`, { markerId: id })
          : undefined
      }
      open={open}
      title={t("editMarkerSlider.title", { markerName: formState.name })}
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
