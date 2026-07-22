import "./App.css";

import { Slide } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";

import CustomAppBar from "./components/AppBar";
import MarkerCreator from "./components/maps/MarkerCreator";
import MarkerEditor from "./components/maps/MarkerEditor";
import MarkerList from "./components/maps/MarkerList";
import { useSlider } from "./components/sliders/hooks/useSliders";

const App = () => {
  const { state } = useSlider();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CustomAppBar />
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
          <MarkerCreator />
          {state.editMarkerSlider && (
            <MarkerEditor marker={state.editMarkerSlider.marker} />
          )}
          <Slide
            direction="left"
            in={!!state.markerListSlider}
            mountOnEnter
            unmountOnExit
          >
            <MarkerList />
          </Slide>
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
