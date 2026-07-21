import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import CustomAppBar from "./components/AppBar";
import CreateMarkerSlider from "./components/maps/CreateMarkerSlider";

const App = () => {
  const [isCreateMarkerSliderOpen, setShowCreateMarkerSlide] = useState(false);
  const [isListMarkerSliderOpen, setShowListMarkerSlide] = useState(false);

  return (
    <div>
      <CustomAppBar
        isCreateMarkerSliderOpen={isCreateMarkerSliderOpen}
        isListMarkerSliderOpen={isListMarkerSliderOpen}
        onClickAddMarker={() => setShowCreateMarkerSlide(true)}
        onClickListMarker={() => setShowListMarkerSlide(true)}
      />
      <MapContainer
        center={[52.52, 13.405]}
        zoom={13}
        style={{ height: "91vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isCreateMarkerSliderOpen && <CreateMarkerSlider />}
        {isListMarkerSliderOpen && (
          <div>{/* Render your ListMarkerSlide component here */}</div>
        )}
      </MapContainer>
    </div>
  );
};

export default App;
