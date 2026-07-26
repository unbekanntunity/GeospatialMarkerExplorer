import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
  useTheme
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMapEvents } from "react-leaflet";

import { MarkerResponse, SectionResponse } from "../../api/generated";
import { useDeleteSection } from "../../models/SectionModel";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import { convertToCoordinate } from "../maps/utils/CoordinationUtils";
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
  const theme = useTheme();

  const [expanded, setIsExpanded] = useState(false);

  const { dispatch: sliderDispatch } = useSlider();
  const { dispatch: modalDispatch } = useModal();

  const deleteSection = useDeleteSection();

  const maps = useMapEvents({});

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

  const onEditMarker = useCallback(
    (marker: MarkerResponse) => {
      sliderDispatch({
        type: SliderAction.HideSlider,
        slider: "editMarkerSlider"
      });

      const coordinates = convertToCoordinate(
        marker.latitude.toString(),
        marker.longitude.toString()
      );

      if (!coordinates) {
        return;
      }

      maps.flyTo(coordinates);

      setTimeout(
        () =>
          sliderDispatch({
            type: SliderAction.ShowSlider,
            slider: "editMarkerSlider",
            payload: {
              marker,
              position: "left"
            }
          }),
        300 // small delay otherwise transition is not smooth and even causes issues with formstate not updating in the edit marker slider
      );
    },
    [maps, sliderDispatch]
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
        <Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "auto auto" }}>
            <Typography>{t("section.description")}</Typography>
            <Typography>
              {isNullOrWhiteSpace(section.description) || "-"}
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography>{t("section.markers")}</Typography>
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 4,
                border: `1px solid ${theme.palette.secondary.main}`,
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "auto auto auto"
              }}
            >
              {section.markers.map((m) => (
                <>
                  <Typography>{t("marker.name")}</Typography>
                  <Typography>{m.name}</Typography>
                  <IconButton onClick={() => onEditMarker(m)}>
                    <RoomOutlinedIcon />
                  </IconButton>
                </>
              ))}
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SectionAccordion;
