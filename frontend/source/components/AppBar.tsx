import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ReorderOutlinedIcon from "@mui/icons-material/ReorderOutlined";
import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  useTheme
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { TOOLTIP_DELAY } from "../constants";
import LanguagePicker from "./language/LanguagePicker";
import { useModal } from "./modals/hooks/useModal";
import { ModalAction } from "./modals/ModalAction";
import { useSlider } from "./sliders/hooks/useSliders";
import { SliderAction } from "./sliders/SliderAction";

interface ICustomAppBarProps {
  showMarkerDetailPoppers: boolean;
  onToggleMarkerDetailPopopers: () => void;
}

const CustomAppBar = (props: ICustomAppBarProps) => {
  const { showMarkerDetailPoppers, onToggleMarkerDetailPopopers } = props;

  const [selectedType, setSelectedType] = useState("markers");

  const { state: sliderState, dispatch: sliderDispatch } = useSlider();
  const { state: modalState, dispatch: modalDispatch } = useModal();

  const { t } = useTranslation();
  const theme = useTheme();

  const onToggleCreateMarkerSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        sliderDispatch({
          type: SliderAction.HideSlider,
          slider: "createMarkerSlider"
        });
      } else {
        sliderDispatch({
          type: SliderAction.ShowSlider,
          slider: "createMarkerSlider",
          payload: {
            position: "left"
          }
        });
      }
    },
    [sliderDispatch]
  );

  const onToggleMarkerListSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        sliderDispatch({
          type: SliderAction.HideSlider,
          slider: "markerListSlider"
        });
      } else {
        sliderDispatch({
          type: SliderAction.ShowSlider,
          slider: "markerListSlider",
          payload: {
            position: "right"
          }
        });
      }
    },
    [sliderDispatch]
  );

  const onOpenCreateCategoryModal = useCallback(() => {
    modalDispatch({
      type: ModalAction.ShowModal,
      modal: "createCategoryModal",
      payload: {}
    });
  }, [modalDispatch]);

  const onToggleCategoryListSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        sliderDispatch({
          type: SliderAction.HideSlider,
          slider: "categoryListSlider"
        });
      } else {
        sliderDispatch({
          type: SliderAction.ShowSlider,
          slider: "categoryListSlider",
          payload: {
            position: "right"
          }
        });
      }
    },
    [sliderDispatch]
  );

  const onToggleCreateSectionSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        sliderDispatch({
          type: SliderAction.HideSlider,
          slider: "createSectionSlider"
        });
      } else {
        sliderDispatch({
          type: SliderAction.ShowSlider,
          slider: "createSectionSlider",
          payload: {
            position: "left"
          }
        });
      }
    },
    [sliderDispatch]
  );

  const onToggleSectionListSlider = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        sliderDispatch({
          type: SliderAction.HideSlider,
          slider: "sectionListSlider"
        });
      } else {
        sliderDispatch({
          type: SliderAction.ShowSlider,
          slider: "sectionListSlider",
          payload: {
            position: "right"
          }
        });
      }
    },
    [sliderDispatch]
  );

  const onChangeType = useCallback((event: SelectChangeEvent) => {
    setSelectedType(event.target.value);
  }, []);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <LanguagePicker />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 2 }}>
            {t("appbar.title")}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              border: `2px solid ${theme.palette.secondary.main}`,
              mr: 4
            }}
          >
            <Select
              sx={{
                borderRadius: 0,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderTop: "none",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: `2px solid ${theme.palette.secondary.main}`
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderTop: "none",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: `2px solid ${theme.palette.secondary.main}`
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderTop: "none",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderRight: `2px solid ${theme.palette.secondary.main}`
                }
              }}
              value={selectedType}
              onChange={onChangeType}
            >
              <MenuItem value="markers">{t("type.markers")}</MenuItem>
              <MenuItem value="sections">{t("type.sections")}</MenuItem>
              <MenuItem value="categories">{t("type.categories")}</MenuItem>
            </Select>
            {selectedType === "markers" && (
              <>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.toggleMarkersDetailPoppers")}
                >
                  <IconButton
                    size="large"
                    color={showMarkerDetailPoppers ? "secondary" : "inherit"}
                    onClick={onToggleMarkerDetailPopopers}
                  >
                    <InsertCommentOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.createMarker")}
                >
                  <IconButton
                    size="large"
                    color={
                      !!sliderState.createMarkerSlider ? "secondary" : "inherit"
                    }
                    onClick={() =>
                      onToggleCreateMarkerSlider(
                        !!sliderState.createMarkerSlider
                      )
                    }
                  >
                    <AddLocationAltOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.listMarkers")}
                >
                  <IconButton
                    size="large"
                    color={
                      !!sliderState.markerListSlider ? "secondary" : "inherit"
                    }
                    onClick={() =>
                      onToggleMarkerListSlider(!!sliderState.markerListSlider)
                    }
                  >
                    <LocationOnOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {selectedType === "categories" && (
              <>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.createCategories")}
                >
                  <IconButton
                    color={
                      !!modalState.createCategoryModal ? "secondary" : "inherit"
                    }
                    size="large"
                    onClick={onOpenCreateCategoryModal}
                  >
                    <AddOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.listCategories")}
                  onClick={() =>
                    onToggleCategoryListSlider(!!sliderState.categoryListSlider)
                  }
                >
                  <IconButton size="large">
                    <ReorderOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {selectedType === "sections" && (
              <>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.createSection")}
                >
                  <IconButton
                    color={
                      !!sliderState.createSectionSlider
                        ? "secondary"
                        : "inherit"
                    }
                    size="large"
                    onClick={() =>
                      onToggleCreateSectionSlider(
                        !!sliderState.createSectionSlider
                      )
                    }
                  >
                    <AddOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  enterDelay={TOOLTIP_DELAY}
                  title={t("tooltip.listSections")}
                  onClick={() =>
                    onToggleSectionListSlider(!!sliderState.sectionListSlider)
                  }
                >
                  <IconButton size="large">
                    <ReorderOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CustomAppBar;
