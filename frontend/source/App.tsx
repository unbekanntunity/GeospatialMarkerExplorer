import { MapContainer, TileLayer } from "react-leaflet";

import CustomAppBar from "./components/AppBar";
import CreateMarkerPopout from "./components/maps/CreateMarkerPopout";

const App = () => {
  return (
    <div>
      <CustomAppBar />
      <MapContainer
        center={[52.52, 13.405]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CreateMarkerPopout />
      </MapContainer>
    </div>
  );
};

export default App;
