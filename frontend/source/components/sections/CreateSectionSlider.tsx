import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateSection } from "../../models/SectionModel";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import SectionSlider from "./SectionSlider";
import { defaultFormState, IFormState } from "./types/IFormState";

interface ICreateSectionSliderProps {
  open: boolean;
  position: SliderPosition;
}

const CreateSectionSlider = (props: ICreateSectionSliderProps) => {
  const { open, position } = props;

  const { dispatch } = useSlider();

  const [formState, setFormState] = useState<IFormState>(defaultFormState);

  const { t } = useTranslation();

  const createSection = useCreateSection();

  const onSubmit = useCallback(() => {
    createSection.mutate({
      ...formState,
      marker_ids: formState.markers.map((m) => m.id)
    });
  }, [createSection, formState]);

  const onClose = useCallback(() => {
    setFormState(defaultFormState);

    dispatch({
      type: SliderAction.HideSlider,
      slider: "createSectionSlider"
    });
  }, [dispatch]);

  return (
    <SectionSlider
      errorMessage={
        createSection.error
          ? t(`section.error.${createSection.error?.name}`)
          : undefined
      }
      open={open}
      position={position}
      title={t("createSectionSlider.title")}
      submitText={t("general.create")}
      formState={formState}
      setFormState={setFormState}
      isSubmitting={createSection.isPending}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default CreateSectionSlider;
