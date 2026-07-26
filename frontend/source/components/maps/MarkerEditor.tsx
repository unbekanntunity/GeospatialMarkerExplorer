import { Box, Typography, useTheme } from "@mui/material";
import { DragEndEvent, LatLngTuple } from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CircleMarker,
  Marker,
  Polyline,
  Tooltip,
  useMapEvents
} from "react-leaflet";

import { MarkerResponse, SectionResponse } from "../../api/generated";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";
import EditMarkerSlider from "./EditMarkerSlider";
import { IFormState } from "./types/IFormState";
import { convertToCoordinate } from "./utils/CoordinationUtils";

interface IMarkerEditorProps {
  showDetailPoppers: boolean;
  sections: SectionResponse[];
  marker: MarkerResponse;
  open: boolean;
  sliderPosition: SliderPosition;
  onClose: () => void;
}

const MarkerEditor = (props: IMarkerEditorProps) => {
  const { showDetailPoppers, sections, marker, open, sliderPosition, onClose } =
    props;

  const { dispatch } = useSlider();
  const theme = useTheme();
  const { t } = useTranslation();

  const [formState, setFormState] = useState<IFormState>({
    name: marker.name,
    description: marker.description,
    latitude: marker.latitude,
    longitude: marker.longitude,
    category: marker.category
  });

  useMapEvents({
    click(e) {
      setFormState((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));
    }
  });

  const position = useMemo(() => {
    return convertToCoordinate(
      formState.latitude.toString(),
      formState.longitude.toString()
    );
  }, [formState.latitude, formState.longitude]);

  const onDragEnd = useCallback((e: DragEndEvent) => {
    const markerObject = e.target;
    const position = markerObject.getLatLng();

    setFormState((prev) => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng
    }));
  }, []);

  const onClickPolyline = useCallback(
    (section: SectionResponse) => {
      onClose();

      dispatch({
        type: SliderAction.ShowSlider,
        slider: "editSectionSlider",
        payload: {
          section,
          position: "left"
        }
      });
    },
    [dispatch, onClose]
  );

  const updatedSections = useMemo(() => {
    return sections.flatMap((s) => {
      const unaffectedMarkers = s.markers.filter((m) => m.id !== marker.id);
      const unaffectedMarkersPositions = unaffectedMarkers
        .map((m) =>
          convertToCoordinate(m.latitude.toString(), m.longitude.toString())
        )
        .filter((pos): pos is LatLngTuple => pos !== undefined);

      const editedMarkerPosition = convertToCoordinate(
        formState.latitude.toString(),
        formState.longitude.toString()
      );

      if (!editedMarkerPosition) {
        return [];
      }

      return {
        section: s,
        positions: [...unaffectedMarkersPositions, editedMarkerPosition]
      };
    });
  }, [sections, formState, marker]);

  return (
    <>
      <EditMarkerSlider
        open={open}
        position={sliderPosition}
        id={marker.id}
        formState={formState}
        setFormState={setFormState}
        onClose={onClose}
      />
      {position && (
        <>
          <CircleMarker
            center={position}
            radius={14}
            pathOptions={{
              color: theme.palette.error.main,
              weight: 3,
              fillOpacity: 0.15
            }}
          />
          <Marker
            draggable
            eventHandlers={{
              dragend: onDragEnd
            }}
            position={position}
          >
            {showDetailPoppers && (
              <Tooltip
                permanent
                direction="top"
                offset={[-15, -15]}
                opacity={0.9}
              >
                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
                  >
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
                    <Typography>{formState.category?.name ?? "-"}</Typography>
                    <Typography>{t("marker.latitude")}</Typography>
                    <Typography>{formState.latitude}</Typography>
                    <Typography>{t("marker.longitude")}</Typography>
                    <Typography>{formState.longitude}</Typography>
                    <Typography>{t("marker.description")}</Typography>
                    <Typography>{formState.description ?? "-"}</Typography>
                  </Box>
                </Box>
              </Tooltip>
            )}
          </Marker>
        </>
      )}
      {updatedSections.map((sectionsWithPositions) => (
        <Polyline
          eventHandlers={{
            click: () => onClickPolyline(sectionsWithPositions.section)
          }}
          positions={sectionsWithPositions.positions}
        />
      ))}
    </>
  );
};

export default MarkerEditor;
