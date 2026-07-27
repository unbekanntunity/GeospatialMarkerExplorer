import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionResponse } from "../../api/generated";
import { useUpdateSection } from "../../models/SectionModel";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import SectionSlider from "./SectionSlider";
import { IFormState } from "./types/IFormState";

interface IEditSectionSliderProps {
  section: SectionResponse;
  open: boolean;
  position: SliderPosition;
}

const EditSectionSlider = (props: IEditSectionSliderProps) => {
  const { section, open, position } = props;

  const [formState, setFormState] = useState<IFormState>({
    name: section.name,
    description: section.description,
    markers: section.markers
  });

  const { t } = useTranslation();
  const { dispatch } = useSlider();

  const updateSection = useUpdateSection();

  const onClose = useCallback(() => {
    dispatch({
      type: SliderAction.HideSlider,
      slider: "editSectionSlider"
    });
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    updateSection.mutate({
      id: section.id,
      section: {
        ...formState,
        marker_ids: formState.markers.map((m) => m.id)
      }
    });

    onClose();
  }, [section, updateSection, formState, onClose]);

  return (
    <SectionSlider
      open={open}
      position={position}
      title={t("editSectionSlider.title", { sectionName: formState.name })}
      submitText={t("general.update")}
      formState={formState}
      setFormState={setFormState}
      isSubmitting={updateSection.isPending}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default EditSectionSlider;
