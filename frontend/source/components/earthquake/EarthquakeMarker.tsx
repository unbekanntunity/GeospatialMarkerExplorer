import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Marker, Tooltip } from "react-leaflet";

import { EarthquakeFeature } from "./types/Earthquake";

interface IEarthquakeMarkerProps {
  showDetailPoppers: boolean;
  earthquake: EarthquakeFeature;
}

const EarthquakeMarker = (props: IEarthquakeMarkerProps) => {
  const { showDetailPoppers, earthquake } = props;

  const { t } = useTranslation();

  return (
    <Marker
      key={earthquake.id}
      position={[
        earthquake.geometry.coordinates[1],
        earthquake.geometry.coordinates[0]
      ]}
    >
      {showDetailPoppers && (
        <Tooltip permanent direction="top" offset={[-15, -15]} opacity={0.9}>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              {earthquake.properties.title}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: "10px 20px",
                gridTemplateColumns: "auto auto"
              }}
            >
              <Typography>{t("earthquake.magnitude")}</Typography>
              <Typography>{earthquake.properties.mag}</Typography>
              <Typography>{t("earthquake.type")}</Typography>
              <Typography>{earthquake.properties.type}</Typography>
            </Box>
          </Box>
        </Tooltip>
      )}
    </Marker>
  );
};

export default EarthquakeMarker;
