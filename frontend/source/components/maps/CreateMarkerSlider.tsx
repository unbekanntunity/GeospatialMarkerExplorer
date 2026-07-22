import { Dispatch, SetStateAction, useCallback } from "react";

import { useCreateMarker } from "../../models/MarkerModel";
import MarkerSlider from "./MarkerSlider";
import { IFormState } from "./types/IFormState";

interface ICreateMarkerSliderProps {
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
}

const CreateMarkerSlider = (props: ICreateMarkerSliderProps) => {
  const { formState, setFormState } = props;

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
    <MarkerSlider
      formState={formState}
      setFormState={setFormState}
      onSubmit={onSubmit}
      onSubmitting={createMarker.isPending}
    />
  );
};

export default CreateMarkerSlider;
