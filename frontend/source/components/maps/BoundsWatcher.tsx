import { LatLngBounds } from "leaflet";
import { useMapEvents } from "react-leaflet";

type BoundsWatcherProps = {
  onBoundsChange: (bounds: LatLngBounds) => void;
};

const BoundsWatcher = ({ onBoundsChange }: BoundsWatcherProps) => {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    }
  });

  return null;
};

export default BoundsWatcher;
