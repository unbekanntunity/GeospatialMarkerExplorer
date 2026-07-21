import { Popover, Typography } from "@mui/material";
import { LatLng } from "leaflet";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMap, useMapEvents } from "react-leaflet";

const POPOVER_OFFSET = 10;

const CreateMarkerPopout = () => {
  const map = useMap();

  const { t } = useTranslation();

  const [clickedPosition, setClickedPosition] = useState<LatLng | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useMapEvents({
    click(e) {
      const point = map.latLngToContainerPoint(e.latlng);
      console.log(e.latlng.lat, e.latlng.lng);

      setClickedPosition(e.latlng);
      setPopoverPosition({
        top: point.y - POPOVER_OFFSET,
        left: point.x + POPOVER_OFFSET
      });
    }
  });

  const handleClose = useCallback(() => {
    setClickedPosition(null);
    setPopoverPosition(null);
  }, []);

  return (
    <Popover
      open={clickedPosition !== null}
      anchorReference="anchorPosition"
      anchorPosition={popoverPosition ?? undefined}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      slotProps={{
        paper: {
          sx: {
            position: "relative",
            overflow: "visible",
            width: 200,

            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid white"
            }
          }
        }
      }}
    >
      <Typography sx={{ p: 2 }}>t("aaa")</Typography>
    </Popover>
  );
};

export default CreateMarkerPopout;
