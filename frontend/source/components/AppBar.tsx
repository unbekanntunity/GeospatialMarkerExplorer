import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import LanguagePicker from "./language/LanguagePicker";
import { useSlider } from "./sliders/hooks/useSliders";
import { SliderAction } from "./sliders/SliderAction";

const CustomAppBar = () => {
  const { state, dispatch } = useSlider();

  const { t } = useTranslation();

  const onToggleCreateMarkerSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        dispatch({
          type: SliderAction.HideSlider,
          slider: "createMarkerSlider"
        });
      } else {
        dispatch({
          type: SliderAction.ShowSlider,
          slider: "createMarkerSlider",
          payload: {
            position: "left"
          }
        });
      }
    },
    [dispatch]
  );

  const onToggleMarkerListSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        dispatch({
          type: SliderAction.HideSlider,
          slider: "markerListSlider"
        });
      } else {
        dispatch({
          type: SliderAction.ShowSlider,
          slider: "markerListSlider",
          payload: {
            position: "right"
          }
        });
      }
    },
    [dispatch]
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <LanguagePicker />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 2 }}>
            {t("appbar.title")}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="large"
            aria-label="add markers"
            color={!!state.createMarkerSlider ? "secondary" : "inherit"}
            onClick={() =>
              onToggleCreateMarkerSlider(!!state.createMarkerSlider)
            }
          >
            <AddLocationAltOutlinedIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="markers"
            color={!!state.markerListSlider ? "secondary" : "inherit"}
            onClick={() => onToggleMarkerListSlider(!!state.markerListSlider)}
          >
            <LocationOnOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CustomAppBar;
