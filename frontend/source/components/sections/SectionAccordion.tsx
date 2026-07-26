import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionResponse } from "../../api/generated";
import { useDeleteSection } from "../../models/SectionModel";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import { useModal } from "../modals/hooks/useModal";
import { ModalAction } from "../modals/ModalAction";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";

interface ISectionAccordionProps {
  section: SectionResponse;
}

const SectionAccordion = (props: ISectionAccordionProps) => {
  const { section } = props;

  const { state } = useSlider();
  const { t } = useTranslation();

  const [expanded, setIsExpanded] = useState(false);

  const { dispatch: sliderDispatch } = useSlider();
  const { dispatch: modalDispatch } = useModal();

  const deleteSection = useDeleteSection();

  const onEditSection = useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      section: SectionResponse
    ) => {
      e.stopPropagation();

      return sliderDispatch({
        type: SliderAction.ShowSlider,
        slider: "editSectionSlider",
        payload: {
          section,
          position: "left"
        }
      });
    },
    [sliderDispatch]
  );

  const onDeleteSection = useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      section: SectionResponse
    ) => {
      e.stopPropagation();

      sliderDispatch({
        type: SliderAction.HideSlider,
        slider: "editMarkerSlider"
      });

      modalDispatch({
        type: ModalAction.ShowModal,
        modal: "confirmDeleteModal",
        payload: {
          entityName: section.name,
          onConfirm: () => deleteSection.mutateAsync(section.id)
        }
      });
    },
    [deleteSection, modalDispatch, sliderDispatch]
  );

  return (
    <Accordion
      key={section.id}
      disableGutters
      expanded={expanded}
      onChange={() => {
        if (isNullOrWhiteSpace(section.description)) {
          return;
        }

        setIsExpanded((prev) => !prev);
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              visibility: isNullOrWhiteSpace(section.description)
                ? "hidden"
                : "visible"
            }}
          />
        }
        sx={{
          flexDirection: "row-reverse",
          "& .MuiAccordionSummary-expandIconWrapper": {
            marginLeft: 0,
            marginRight: 1
          }
        }}
      >
        <ListItem>
          <ListItemText
            primary={section.name}
            secondary={t("accordion.id", { id: section.id })}
          />
          <IconButton
            color={
              !!state.editSectionSlider &&
              state.editSectionSlider.section.id === section.id
                ? "secondary"
                : "inherit"
            }
            component="span"
            onClick={(e) => onEditSection(e, section)}
          >
            <CreateOutlinedIcon />
          </IconButton>
          <IconButton
            component="span"
            onClick={(e) => onDeleteSection(e, section)}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto"
          }}
        >
          <Typography>{t("marker.description")}</Typography>
          <Typography>
            {isNullOrWhiteSpace(section.description) || "-"}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SectionAccordion;
