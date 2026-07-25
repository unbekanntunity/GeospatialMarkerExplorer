import { Box, Typography } from "@mui/material";
import { DragEndEvent } from "leaflet";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Marker, Tooltip } from "react-leaflet";

import { MarkerResponse } from "../../api/generated";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMapMarkerProps {
  showDetailPoppers: boolean;
  marker: MarkerResponse;
}

const MapMarker = (props: IMapMarkerProps) => {
  const { marker, showDetailPoppers } = props;

  const { dispatch } = useSlider();

  const { t } = useTranslation();

  const coordinates = useMemo(
    () =>
      convertToCoordinate(
        marker.latitude.toString(),
        marker.longitude.toString()
      ),
    [marker]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent, marker: MarkerResponse) => {
      const markerObject = e.target;
      const position = markerObject.getLatLng();

      const updatedMarker: MarkerResponse = {
        ...marker,
        latitude: position.lat,
        longitude: position.lng
      };

      dispatch({
        type: SliderAction.ShowSlider,
        slider: "editMarkerSlider",
        payload: {
          marker: updatedMarker,
          position: "left"
        }
      });
    },
    [dispatch]
  );

  const onClickMarker = useCallback(() => {
    dispatch({
      type: SliderAction.ShowSlider,
      slider: "editMarkerSlider",
      payload: {
        marker,
        position: "left"
      }
    });
  }, [marker, dispatch]);

  return coordinates ? (
    <Marker
      draggable
      eventHandlers={{
        click: onClickMarker,
        dragend: (e) => onDragEnd(e, marker)
      }}
      position={coordinates}
    >
      {showDetailPoppers && (
        <Tooltip permanent direction="top" offset={[-15, -15]} opacity={0.9}>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              {marker.name}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: "10px 20px",
                gridTemplateColumns: "auto auto"
              }}
            >
              <Typography>{t("marker.category")}</Typography>
              <Typography>{marker.category?.name ?? "-"}</Typography>
              <Typography>{t("marker.latitude")}</Typography>
              <Typography>{marker.latitude}</Typography>
              <Typography>{t("marker.longitude")}</Typography>
              <Typography>{marker.longitude}</Typography>
              <Typography>{t("marker.description")}</Typography>
              <Typography>{marker.description ?? "-"}</Typography>
            </Box>
          </Box>
        </Tooltip>
      )}
    </Marker>
  ) : null;
};

export default MapMarker;
