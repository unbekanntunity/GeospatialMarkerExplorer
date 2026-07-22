import { Dispatch, SetStateAction, useCallback } from "react";

import { useUpdateMarker } from "../../models/MarkerModel";
import MarkerSlider from "./MarkerSlider";
import { IFormState } from "./types/IFormState";

interface IEditMarkerSliderProps {
  id: string;
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
}

const EditMarkerSlider = (props: IEditMarkerSliderProps) => {
  const { id, formState, setFormState } = props;

  const updateMarker = useUpdateMarker();

  const onSubmit = useCallback(() => {
    if (formState.name === null) {
      return;
    }

    updateMarker.mutate({ id, marker: formState });
  }, [id, formState, updateMarker]);

  return (
    <MarkerSlider
      formState={formState}
      setFormState={setFormState}
      onSubmit={onSubmit}
      onSubmitting={updateMarker.isPending}
    />
  );
};

export default EditMarkerSlider;
