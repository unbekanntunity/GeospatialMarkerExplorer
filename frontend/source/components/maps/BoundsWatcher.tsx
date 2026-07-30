import { LatLngBounds } from "leaflet";
import { useMapEvents } from "react-leaflet";

interface IBoundsWatcherProps {
  onBoundsChange: (bounds: LatLngBounds) => void;
}

const BoundsWatcher = (props: IBoundsWatcherProps) => {
  const { onBoundsChange } = props;

  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    }
  });

  return null;
};

export default BoundsWatcher;
