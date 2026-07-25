import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  InputAdornment,
  List,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { forwardRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import useDebounce from "../../hooks/useDebounce";
import { useMarkers } from "../../models/MarkerModel";
import CategoryDropdown from "../categories/CategoryDropdown";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import MarkerAccordion from "./MarkerAccordion";
import Slider from "./Slider";

interface IMarkerListProps {
  open: boolean;
  position: SliderPosition;
}

const MarkerListSlider = forwardRef<HTMLDivElement, IMarkerListProps>(
  (props, ref) => {
    const { open, position } = props;

    const [searchMarkerName, setSearchMarkerName] = useState("");
    const [filterByCategoryIds, setFilterByCategoryIds] = useState<string[]>(
      []
    );

    const debouncedSearchMarkerName = useDebounce(searchMarkerName, 300);

    const { data: markers, isFetching } = useMarkers({
      name: debouncedSearchMarkerName || undefined,
      category_ids: filterByCategoryIds
    });

    const { dispatch } = useSlider();
    const { t } = useTranslation();
    const theme = useTheme();

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
      <Slider
        open={open}
        ref={ref}
        position={position}
        title={t("listMarkersSlider.title")}
        onClose={onClose}
      >
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
            <CategoryDropdown
              categoryIds={filterByCategoryIds}
              setCategoryIds={setFilterByCategoryIds}
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
              <CircularProgress color="secondary" />
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
                {t("listMarkersSlider.empty")}
              </Typography>
            </Box>
          )}
        </>
      </Slider>
    );
  }
);

export default MarkerListSlider;
