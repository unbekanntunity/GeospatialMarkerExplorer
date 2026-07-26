import { Box, CircularProgress, List, Typography } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { SectionResponse } from "../../api/generated";
import Slider from "../maps/Slider";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import SectionAccordion from "./SectionAccordion";

interface ISectionListSliderProps {
  sections: SectionResponse[];
  isFetching: boolean;
  open: boolean;
  position: SliderPosition;
}

const SectionListSlider = (props: ISectionListSliderProps) => {
  const { open, position, sections, isFetching } = props;

  const { dispatch } = useSlider();
  const { t } = useTranslation();

  const onClose = useCallback(() => {
    dispatch({
      type: SliderAction.HideSlider,
      slider: "sectionListSlider"
    });
  }, [dispatch]);

  return (
    <Slider
      title={t("listSectionsSlider.title")}
      open={open}
      position={position}
      onClose={onClose}
    >
      <>
        {!isFetching && sections !== undefined && sections.length > 0 && (
          <List
            sx={{
              overflowY: "auto",
              flex: 1
            }}
          >
            {sections.map((section) => (
              <SectionAccordion key={section.id} section={section} />
            ))}
          </List>
        )}
        {isFetching && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        )}
        {!isFetching && sections.length === 0 && (
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <Typography variant="body2">
              {t("listSectionsSlider.empty")}
            </Typography>
          </Box>
        )}
      </>
    </Slider>
  );
};

export default SectionListSlider;
