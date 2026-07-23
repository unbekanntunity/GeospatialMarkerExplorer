import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  Paper,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import L from "leaflet";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useDebounce from "../../hooks/useDebounce";
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

    const [searchMarkerName, setSearchMarkerName] = useState<string>("");

    const debouncedSearchMarkerName = useDebounce(searchMarkerName, 300);

    const { data: markers, isFetching } = useMarkers({
      name: debouncedSearchMarkerName || undefined
    });

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

    const onChangeName = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchMarkerName(e.target.value);
      },
      []
    );

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
          zIndex: 1000
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
          <Box>
            <TextField
              fullWidth
              value={searchMarkerName}
              onChange={onChangeName}
              variant="outlined"
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: theme.palette.primary.light
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Box>
          {!isFetching && markers !== undefined && markers.length > 0 && (
            <List
              sx={{
                overflowY: "auto",
                flex: 1
              }}
            >
              {markers.map((marker) => (
                <MarkerAccordion key={marker.id} marker={marker} />
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
              <CircularProgress />
            </Box>
          )}
          {!isFetching && (!markers || markers.length === 0) && (
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
