import {
  Alert,
  Box,
  Button,
  CircularProgress,
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

import { CategoryResponse } from "../../api/generated";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import CategorySelect from "../categories/CategorySelect";
import { SliderPosition } from "../sliders/SliderAction";
import Slider from "./Slider";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerSliderProps {
  errorMessage?: string;
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
      errorMessage,
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
      (newCategory: CategoryResponse | null) => {
        setFormState((prev) => ({
          ...prev,
          category: newCategory
        }));
      },
      [setFormState]
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
            <CategorySelect
              category={formState.category}
              setCategory={onChangeCategory}
            />
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
          <Box sx={{ flex: 1 }} />
          {errorMessage && (
            <Alert sx={{ m: 4 }} severity="error">
              <Typography
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {errorMessage}
              </Typography>
            </Alert>
          )}
        </>
      </Slider>
    );
  }
);

export default MarkerSlider;
