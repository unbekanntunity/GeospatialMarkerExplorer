import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import useDebounce from "../../hooks/useDebounce";
import { useMarkers } from "../../models/MarkerModel";
import CustomAppBar from "../AppBar";
import CategoryListSlider from "../categories/CategoryListSlider";
import MapMarker from "../maps/MapMarker";
import MarkerCreator from "../maps/MarkerCreator";
import MarkerEditor from "../maps/MarkerEditor";
import MarkerListSlider from "../maps/MarkerListSlider";
import { useSlider } from "../sliders/hooks/useSliders";

const MapPage = () => {
  const [showMarkerDetailPoppers, setShowMarkerDetailPoppers] = useState(true);

  const [searchMarkerName, setSearchMarkerName] = useState("");
  const [filterByCategoryIds, setFilterByCategoryIds] = useState<string[]>([]);

  const debouncedSearchMarkerName = useDebounce(searchMarkerName, 300);

  const { state } = useSlider();

  const { data: markers, isFetching } = useMarkers({
    name: debouncedSearchMarkerName,
    category_ids: filterByCategoryIds
  });

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
          {markers
            ?.filter((m) => m.id !== state.editMarkerSlider?.marker.id)
            .map((m) => (
              <MapMarker
                key={m.id}
                showDetailPoppers={showMarkerDetailPoppers}
                marker={m}
              />
            ))}
          <MarkerCreator />
          {state.categoryListSlider && (
            <CategoryListSlider
              open={!!state.categoryListSlider}
              position={state.categoryListSlider.position}
            />
          )}
          {state.editMarkerSlider && (
            <MarkerEditor
              open={!!state.editMarkerSlider}
              sliderPosition={state.editMarkerSlider.position}
              marker={state.editMarkerSlider.marker}
            />
          )}
          {state.markerListSlider && (
            <MarkerListSlider
              isFetching={isFetching}
              searchName={searchMarkerName}
              setSearchName={setSearchMarkerName}
              categoryIds={filterByCategoryIds}
              setCategoryIds={setFilterByCategoryIds}
              open={!!state.markerListSlider}
              position={state.markerListSlider.position}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
