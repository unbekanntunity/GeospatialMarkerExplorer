import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography
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

import { useCreateMarker } from "../../models/MarkerModel";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface ICreateMarkerSliderProps {
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
}

const CreateMarkerSlider = forwardRef<HTMLDivElement, ICreateMarkerSliderProps>(
  (props, ref) => {
    const { formState, setFormState } = props;

    const { t } = useTranslation();

    const createMarker = useCreateMarker();

    const validFormState = useMemo(() => {
      return formState.name !== "";
    }, [formState]);

    const maps = useMapEvents({});

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

    const onSubmit = useCallback(() => {
      createMarker.mutate({
        ...formState
      });
    }, [formState, createMarker]);

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
          width: "25vw",
          zIndex: 1000
        }}
      >
        <Paper
          sx={{
            border: "4px solid yellow",
            height: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          }}
        >
          <Box
            sx={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "auto auto",
              gap: 2,
              mt: 4
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
            disabled={!validFormState || createMarker.isPending}
            onClick={onSubmit}
          >
            {t("Create marker")}
          </Button>

          {createMarker.error && (
            <Box sx={{ mt: "auto" }}>
              <Alert severity="error">{t(createMarker.error.message)}</Alert>
            </Box>
          )}
        </Paper>
      </Box>
    );
  }
);

export default CreateMarkerSlider;
