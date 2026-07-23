import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import {
  Box,
  IconButton,
  List,
  Paper,
  Typography,
  useTheme
} from "@mui/material";
import L from "leaflet";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useMarkers } from "../../models/MarkerModel";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import MarkerAccordion from "./MarkerAccordion";

interface IMarkerListProps {
  position: SliderPosition;
}

const MarkerList = forwardRef<HTMLDivElement, IMarkerListProps>(
  (props, ref) => {
    const { position } = props;

    const { data: markers } = useMarkers();

    const { dispatch } = useSlider();
    const { t } = useTranslation();
    const theme = useTheme();

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

    const onClose = useCallback(() => {
      dispatch({
        type: SliderAction.HideSlider,
        slider: "markerListSlider"
      });
    }, [dispatch]);

    return (
      <Box
        ref={setRefs}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: position === "left" ? 0 : "unset",
          right: position === "right" ? 0 : "unset",
          width: "25vw",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.secondary.main,
              p: 2
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                fontWeight: 600
              }}
            >
              {t(`Markers`)}
            </Typography>
            <IconButton color="primary" onClick={onClose}>
              <ClearOutlinedIcon />
            </IconButton>
          </Box>
          {markers && markers.length !== 0 && (
            <List
              sx={{
                overflowY: "auto",
                flex: 1
              }}
            >
              {markers?.map((marker) => (
                <MarkerAccordion key={marker.id} marker={marker} />
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
  }
);

export default MarkerList;
