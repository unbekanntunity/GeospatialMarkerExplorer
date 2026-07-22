import "./App.css";

import { Slide } from "@mui/material";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import CustomAppBar from "./components/AppBar";
import MarkerCreator from "./components/maps/MarkerCreator";
import MarkerList from "./components/maps/MarkerList";

const App = () => {
  const [isCreateMarkerSliderOpen, setShowCreateMarkerSlide] = useState(false);
  const [isMarkerListSliderOpen, setShowListMarkerSlide] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CustomAppBar
        isCreateMarkerSliderOpen={isCreateMarkerSliderOpen}
        isListMarkerSliderOpen={isMarkerListSliderOpen}
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
          {
            <Slide
              direction="left"
              in={isMarkerListSliderOpen}
              mountOnEnter
              unmountOnExit
            >
              <MarkerList />
            </Slide>
          }
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
