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
import { Dispatch, forwardRef, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { MarkerResponse } from "../../api/generated";
import CategoryDropdown from "../categories/CategoryDropdown";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import MarkerAccordion from "./MarkerAccordion";
import Slider from "./Slider";

interface IMarkerListProps {
  open: boolean;
  position: SliderPosition;
  markers: MarkerResponse[];
  searchName: string;
  setSearchName: Dispatch<SetStateAction<string>>;
  categoryIds: string[];
  setCategoryIds: Dispatch<SetStateAction<string[]>>;
  isFetching: boolean;
}

const MarkerListSlider = forwardRef<HTMLDivElement, IMarkerListProps>(
  (props, ref) => {
    const {
      markers,
      isFetching,
      searchName,
      setSearchName,
      categoryIds,
      setCategoryIds,
      open,
      position
    } = props;

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
        setSearchName(e.target.value);
      },
      [setSearchName]
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
              value={searchName}
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
              categoryIds={categoryIds}
              setCategoryIds={setCategoryIds}
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
