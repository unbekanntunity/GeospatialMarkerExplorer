import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import L from "leaflet";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import { useTranslation } from "react-i18next";
import { useMapEvents } from "react-leaflet";

import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import { SliderPosition } from "../sliders/SliderAction";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerSliderProps {
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
    const theme = useTheme();

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
            border: `4px solid ${theme.palette.secondary.main}`,
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
              {title}
            </Typography>
            <IconButton color="primary" onClick={onClose}>
              <ClearOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "auto auto",
              gap: 2,
              mt: 4,
              p: 2
            }}
          >
            <Typography variant="subtitle2">{t(`Name`)}</Typography>
            <TextField
              id="name-textfield"
              label={t("Name")}
              value={formState.name}
              onChange={onChangeName}
            />
            <Typography variant="subtitle2">{t(`Latitude`)}</Typography>
            <TextField
              id="latitude-textarea"
              label={t("Latitude")}
              value={formState.latitude}
              onChange={onChangeLatitude}
            />
            <Typography variant="subtitle2">{t(`Longitude:`)}</Typography>
            <TextField
              id="longitude-textfield"
              label={t("Longitude")}
              value={formState.longitude}
              onChange={onChangeLongitude}
            />

            <Typography variant="subtitle2">{t(`Description`)}</Typography>
            <TextField
              id="description-textarea"
              label={t("Description")}
              multiline
              value={formState.description}
              onChange={onChangeDescription}
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
        </Paper>
      </Box>
    );
  }
);

export default MarkerSlider;
