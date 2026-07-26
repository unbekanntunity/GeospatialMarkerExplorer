import { LatLngBounds } from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

import { SectionResponse } from "../../api/generated";
import useDebounce from "../../hooks/useDebounce";
import { useEarthquakes } from "../../models/EarthquakeModel";
import { useMarkers } from "../../models/MarkerModel";
import { useSections } from "../../models/SectionModel";
import { stringsByAlphabet } from "../../utils/StringUtils";
import CustomAppBar from "../AppBar";
import CategoryListSlider from "../categories/CategoryListSlider";
import EarthquakeMarker from "../earthquake/EarthquakeMarker";
import BoundsWatcher from "../maps/BoundsWatcher";
import MapMarker from "../maps/MapMarker";
import MarkerCreator from "../maps/MarkerCreator";
import MarkerEditor from "../maps/MarkerEditor";
import MarkerListSlider from "../maps/MarkerListSlider";
import CreateSectionSlider from "../sections/CreateSectionSlider";
import EditSectionSlider from "../sections/EditSectionSlider";
import SectionListSlider from "../sections/SectionListSlider";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";

const MapPage = () => {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const [showMarkerDetailPoppers, setShowMarkerDetailPoppers] = useState(true);

  const [searchMarkerName, setSearchMarkerName] = useState("");
  const [filterByCategoryIds, setFilterByCategoryIds] = useState<string[]>([]);

  const debouncedSearchMarkerName = useDebounce(searchMarkerName, 300);
  const debouncedBounds = useDebounce(bounds, 300);

  const { state, dispatch } = useSlider();

  const { data: markers, isFetching: isFetchingMarkers } = useMarkers({
    name: debouncedSearchMarkerName,
    category_ids: filterByCategoryIds
  });

  const { data: sections, isFetching: isFetchingSections } = useSections();

  const { data: earthquakes } = useEarthquakes({
    bounds: debouncedBounds
  });

  const sortedMarkers = useMemo(
    () => markers?.sort((a, b) => stringsByAlphabet(a.name, b.name)) ?? [],
    [markers]
  );

  const markersWithoutTheOneEdited = useMemo(() => {
    return (
      markers?.filter((m) => m.id !== state.editMarkerSlider?.marker.id) ?? []
    );
  }, [markers, state.editMarkerSlider]);

  const sectionsWithoutTheOneEdited = useMemo(() => {
    return (
      sections?.filter(
        (s) =>
          !s.markers.some((m) => m.id === state.editMarkerSlider?.marker.id)
      ) ?? []
    );
  }, [sections, state.editMarkerSlider]);

  const sectionsAffectedByMarkerEdit = useMemo(() => {
    return (
      sections?.filter((s) =>
        s.markers.some((m) => m.id === state.editMarkerSlider?.marker.id)
      ) ?? []
    );
  }, [sections, state.editMarkerSlider]);

  const onClickPolyline = useCallback(
    (section: SectionResponse) => {
      dispatch({
        type: SliderAction.ShowSlider,
        slider: "editSectionSlider",
        payload: {
          section,
          position: "left"
        }
      });
    },
    [dispatch]
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CustomAppBar
        showMarkerDetailPoppers={showMarkerDetailPoppers}
        onToggleMarkerDetailPopopers={() =>
          setShowMarkerDetailPoppers((prev) => !prev)
        }
      />
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[52.52, 13.405]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsWatcher onBoundsChange={setBounds} />
          {markersWithoutTheOneEdited.map((m) => (
            <MapMarker
              key={m.id}
              showDetailPoppers={showMarkerDetailPoppers}
              marker={m}
            />
          ))}
          {earthquakes?.features.map((e) => (
            <EarthquakeMarker
              earthquake={e}
              showDetailPoppers={showMarkerDetailPoppers}
            />
          ))}
          {sectionsWithoutTheOneEdited.map((section) => (
            <Polyline
              key={section.id}
              eventHandlers={{
                click: () => onClickPolyline(section)
              }}
              positions={section.markers.map((m) => [m.latitude, m.longitude])}
            />
          ))}
          <MarkerCreator
            onClose={() =>
              dispatch({
                type: SliderAction.HideSlider,
                slider: "createMarkerSlider"
              })
            }
          />
          {state.categoryListSlider && (
            <CategoryListSlider
              open={!!state.categoryListSlider}
              position={state.categoryListSlider.position}
            />
          )}
          {state.editMarkerSlider && (
            <MarkerEditor
              showDetailPoppers={showMarkerDetailPoppers}
              sections={sectionsAffectedByMarkerEdit}
              open={!!state.editMarkerSlider}
              sliderPosition={state.editMarkerSlider.position}
              marker={state.editMarkerSlider.marker}
              onClose={() =>
                dispatch({
                  type: SliderAction.HideSlider,
                  slider: "editMarkerSlider"
                })
              }
            />
          )}
          {state.markerListSlider && (
            <MarkerListSlider
              markers={sortedMarkers}
              isFetching={isFetchingMarkers}
              searchName={searchMarkerName}
              setSearchName={setSearchMarkerName}
              categoryIds={filterByCategoryIds}
              setCategoryIds={setFilterByCategoryIds}
              open={!!state.markerListSlider}
              position={state.markerListSlider.position}
            />
          )}
          {state.createSectionSlider && (
            <CreateSectionSlider
              open={!!state.createSectionSlider}
              position={state.createSectionSlider.position}
            />
          )}
          {state.editSectionSlider && (
            <EditSectionSlider
              section={state.editSectionSlider.section}
              open={!!state.editSectionSlider}
              position={state.editSectionSlider.position}
            />
          )}
          {state.sectionListSlider && (
            <SectionListSlider
              sections={sections ?? []}
              isFetching={isFetchingSections}
              open={!!state.sectionListSlider}
              position={state.sectionListSlider.position}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
