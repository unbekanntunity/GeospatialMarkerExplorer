import "./App.css";

import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import CustomAppBar from "./components/AppBar";
import MarkerCreator from "./components/maps/MarkerCreator";

const App = () => {
  const [isCreateMarkerSliderOpen, setShowCreateMarkerSlide] = useState(false);
  const [isListMarkerSliderOpen, setShowListMarkerSlide] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CustomAppBar
        isCreateMarkerSliderOpen={isCreateMarkerSliderOpen}
        isListMarkerSliderOpen={isListMarkerSliderOpen}
        onClickAddMarker={() => setShowCreateMarkerSlide((prev) => !prev)}
        onClickListMarker={() => setShowListMarkerSlide((prev) => !prev)}
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
          <MarkerCreator
            open={isCreateMarkerSliderOpen}
            onOpen={() => setShowCreateMarkerSlide(true)}
          />
          {isListMarkerSliderOpen && (
            <div>{/* Render your ListMarkerSlide component here */}</div>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
