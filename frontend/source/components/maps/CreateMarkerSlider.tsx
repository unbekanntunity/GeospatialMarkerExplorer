import { Box, Paper, TextField, Typography } from "@mui/material";
import { LatLng } from "leaflet";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMapEvents } from "react-leaflet";

const CreateMarkerSlider = () => {
  const { t } = useTranslation();

  const [clickedPosition, setClickedPosition] = useState<LatLng | null>(null);

  useMapEvents({
    click(e) {
      console.log(e.latlng.lat, e.latlng.lng);
      setClickedPosition(e.latlng);
    }
  });

  return (
    <Box
      sx={{
        position: "fixed",
        height: "100vh",
        width: "20vw",
        zIndex: 1000
      }}
    >
      <Paper elevation={4} sx={{ height: "100%", p: 2, textAlign: "center" }}>
        <TextField label={t("Marker name")} variant="standard" />
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2">
            {t(`at latitude: ${clickedPosition?.lat}`)}
          </Typography>
          <Typography variant="subtitle2">
            {t(`at longitude: ${clickedPosition?.lng}`)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateMarkerSlider;
