import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  ListItem,
  ListItemText,
  Typography
} from "@mui/material";
import { useCallback, useState } from "react";

import { MarkerResponse } from "../../api/generated";
import { useDeleteMarker } from "../../models/MarkerModel";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import { useModals } from "../modals/hooks/useModals";
import { ModalAction } from "../modals/ModalAction";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";

interface IMarkerAccordionProps {
  marker: MarkerResponse;
}

const MarkerAccordion = (props: IMarkerAccordionProps) => {
  const { marker } = props;

  const { state } = useSlider();

  const [expanded, setIsExpanded] = useState(false);

  const { dispatch: sliderDispatch } = useSlider();
  const { dispatch: modalDispatch } = useModals();

  const deleteMarker = useDeleteMarker();

  const onEditMarker = useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      marker: MarkerResponse
    ) => {
      e.stopPropagation();

      return sliderDispatch({
        type: SliderAction.ShowSlider,
        slider: "editMarkerSlider",
        payload: {
          marker,
          position: "left"
        }
      });
    },
    [sliderDispatch]
  );

  const onDeleteMarker = useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      marker: MarkerResponse
    ) => {
      e.stopPropagation();

      modalDispatch({
        type: ModalAction.ShowModal,
        modal: "confirmDeleteModal",
        payload: {
          onConfirm: () => deleteMarker.mutateAsync(marker.id)
        }
      });
    },
    [deleteMarker, modalDispatch]
  );

  return (
    <Accordion
      key={marker.id}
      disableGutters
      expanded={expanded}
      onChange={() => {
        if (isNullOrWhiteSpace(marker.description)) {
          return;
        }

        setIsExpanded((prev) => !prev);
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              visibility: isNullOrWhiteSpace(marker.description)
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
            primary={marker.name}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ display: "block" }}
                >
                  {`lat: ${marker.latitude}`}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ display: "block" }}
                >
                  {`long: ${marker.longitude}`}
                </Typography>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ display: "block" }}
                >
                  {`id: ${marker.id}`}
                </Typography>
              </>
            }
          />
          <IconButton
            color={
              !!state.editMarkerSlider &&
              state.editMarkerSlider.marker.id === marker.id
                ? "secondary"
                : "inherit"
            }
            component="span"
            onClick={(e) => onEditMarker(e, marker)}
          >
            <CreateOutlinedIcon />
          </IconButton>
          <IconButton
            component="span"
            onClick={(e) => onDeleteMarker(e, marker)}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{marker.description}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default MarkerAccordion;
