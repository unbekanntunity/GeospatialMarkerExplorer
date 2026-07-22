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
import { useState } from "react";

import { MarkerResponse } from "../../api/generated";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";

interface IMarkerAccordionProps {
  marker: MarkerResponse;
}

const MarkerAccordion = (props: IMarkerAccordionProps) => {
  const { marker } = props;

  const [expanded, setIsExpanded] = useState(false);

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
                <Typography variant="body2">{`lat: ${marker.latitude}`}</Typography>
                <Typography variant="body2">{`long: ${marker.longitude}`}</Typography>
              </>
            }
          />
          <IconButton>
            <CreateOutlinedIcon />
          </IconButton>
          <IconButton>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>{marker.description}</AccordionDetails>
    </Accordion>
  );
};

export default MarkerAccordion;
