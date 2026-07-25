import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useMemo
} from "react";
import { useTranslation } from "react-i18next";
import { useMapEvents } from "react-leaflet";

import { NONE_SELECTED } from "../../constants";
import { useCategories } from "../../models/CategoryModel";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import { SliderPosition } from "../sliders/SliderAction";
import Slider from "./Slider";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerSliderProps {
  open: boolean;
  title: string;
  submitText: string;
  position: SliderPosition;
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

const MarkerSlider = forwardRef<HTMLDivElement, IMarkerSliderProps>(
  (props, ref) => {
    const {
      open,
      title,
      submitText,
      position,
      formState,
      setFormState,
      onSubmit,
      isSubmitting,
      onClose
    } = props;

    const maps = useMapEvents({});

    const { data: categories, isFetching: isFetchingCategories } =
      useCategories({});

    const { t } = useTranslation();

    const validFormState = useMemo(() => {
      return !isNullOrWhiteSpace(formState.name);
    }, [formState.name]);

    const onChangeName = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
          ...prev,
          name: e.target.value
        }));
      },
      [setFormState]
    );

    const onChangeLatitude = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => {
          const coordinates = convertToCoordinate(
            e.target.value,
            prev.longitude.toString()
          );

          if (coordinates) {
            maps.flyTo(coordinates);
          }

          return {
            ...prev,
            latitude: coordinates ? coordinates[0] : prev.latitude
          };
        });
      },
      [maps, setFormState]
    );

    const onChangeLongitude = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => {
          const coordinates = convertToCoordinate(
            prev.latitude.toString(),
            e.target.value
          );

          if (coordinates) {
            maps.flyTo(coordinates);
          }

          return {
            ...prev,
            longitude: coordinates ? coordinates[1] : prev.longitude
          };
        });
      },
      [maps, setFormState]
    );

    const onChangeDescription = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
          ...prev,
          description: e.target.value
        }));
      },
      [setFormState]
    );

    const onChangeCategory = useCallback(
      (event: SelectChangeEvent<string | null>) => {
        const categoryId = event.target.value;
        const category = categories?.find((c) => c.id === categoryId);

        setFormState((prev) => ({
          ...prev,
          category: category ?? null
        }));
      },
      [categories, setFormState]
    );

    return (
      <Slider
        title={title}
        open={open}
        ref={ref}
        position={position}
        onClose={onClose}
      >
        <>
          <Box
            className="marker-slider"
            sx={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "auto auto",
              gap: 2,
              mt: 4,
              p: 2
            }}
          >
            <Typography variant="subtitle2">{t("marker.name")}</Typography>
            <TextField value={formState.name} onChange={onChangeName} />
            <Typography variant="subtitle2">{t("marker.latitude")}</Typography>
            <TextField value={formState.latitude} onChange={onChangeLatitude} />
            <Typography variant="subtitle2">{t("marker.longitude")}</Typography>
            <TextField
              value={formState.longitude}
              onChange={onChangeLongitude}
            />
            <Typography variant="subtitle2">
              {t("marker.description")}
            </Typography>
            <TextField
              multiline
              value={formState.description}
              onChange={onChangeDescription}
            />
            <Typography variant="subtitle2">{t("marker.category")}</Typography>
            <Select
              MenuProps={{
                container: document.body
              }}
              value={formState.category?.id ?? NONE_SELECTED}
              onChange={onChangeCategory}
            >
              <MenuItem key={NONE_SELECTED} value={NONE_SELECTED}>
                {t("marker.noCategorySelected")}
              </MenuItem>
              {isFetchingCategories && (
                <MenuItem disabled sx={{ justifySelf: "center" }}>
                  <CircularProgress color="secondary" size="0.9em" />{" "}
                </MenuItem>
              )}
              {!isFetchingCategories &&
                categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </Box>
          <Button
            sx={{ mt: 8, alignSelf: "center" }}
            color="secondary"
            variant="contained"
            startIcon={
              isSubmitting ? <CircularProgress size="0.9em" /> : undefined
            }
            disabled={!validFormState || isSubmitting}
            onClick={onSubmit}
          >
            {submitText}
          </Button>
        </>
      </Slider>
    );
  }
);

export default MarkerSlider;
