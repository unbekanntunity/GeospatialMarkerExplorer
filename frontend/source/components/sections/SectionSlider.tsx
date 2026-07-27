import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { MarkerResponse } from "../../api/generated";
import { isNullOrWhiteSpace } from "../../utils/StringUtils";
import Slider, { ISliderProps } from "../maps/Slider";
import MarkerSelect from "./MarkerSelect";
import { IFormState } from "./types/IFormState";

interface ISectionSliderProps extends ISliderProps {
  errorMessage?: string;
  formState: IFormState;
  submitText: string;
  isSubmitting: boolean;
  setFormState: Dispatch<SetStateAction<IFormState>>;
  onSubmit: () => void;
}

const SectionSlider = (props: ISectionSliderProps) => {
  const {
    errorMessage,
    open,
    title,
    position,
    formState,
    submitText,
    isSubmitting,
    setFormState,
    onClose,
    onSubmit
  } = props;

  const { t } = useTranslation();

  const validFormState = useMemo(() => {
    return !isNullOrWhiteSpace(formState.name) && formState.markers.length > 1;
  }, [formState]);

  const onChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        name: e.target.value
      }));
    },
    [setFormState]
  );

  const onChangeMarkers = useCallback(
    (newMarkers: MarkerResponse[]) => {
      setFormState((prev) => ({
        ...prev,
        markers: newMarkers
      }));
    },
    [setFormState]
  );

  return (
    <Slider open={open} title={title} position={position} onClose={onClose}>
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
          <Typography variant="subtitle2">{t("section.name")}</Typography>
          <TextField value={formState.name} onChange={onChangeName} />
          <Typography
            sx={{
              alignSelf: "start",
              pt: 1.5
            }}
            variant="subtitle2"
          >
            {t("section.markers")}
          </Typography>
          <MarkerSelect
            selectedMarker={formState.markers}
            onChangeMarker={onChangeMarkers}
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
};

export default SectionSlider;
