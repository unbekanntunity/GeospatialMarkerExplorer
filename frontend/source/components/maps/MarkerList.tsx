import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import L from "leaflet";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useMarkers } from "../../models/MarkerModel";

const MarkerList = forwardRef<HTMLDivElement>((props, ref) => {
  const { data: markers } = useMarkers();

  const { t } = useTranslation();

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      sliderRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  useEffect(() => {
    if (!sliderRef.current) {
      return;
    }

    L.DomEvent.disableClickPropagation(sliderRef.current);
    L.DomEvent.disableScrollPropagation(sliderRef.current);
  }, []);

  console.log(markers);

  return (
    <Box
      ref={setRefs}
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: "20vw",
        zIndex: 1000,
        overflow: "hidden"
      }}
    >
      <Paper
        sx={{
          border: "4px solid yellow",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box"
        }}
      >
        {markers && markers.length !== 0 && (
          <List
            sx={{
              overflowY: "auto",
              flex: 1
            }}
          >
            {markers?.map((marker) => (
              <Accordion key={marker.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                  </ListItem>
                </AccordionSummary>
                <AccordionDetails>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        )}
        {(markers === undefined || markers?.length === 0) && (
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
              {t(
                "Seems like there are no markers. Go and create one by clicking on the map"
              )}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
});

export default MarkerList;
