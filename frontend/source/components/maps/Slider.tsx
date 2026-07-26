import { Slide } from "@mui/material";
import { forwardRef, JSX, useCallback, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

import { SliderPosition } from "../sliders/SliderAction";
import SliderBase from "./SliderBase";

export interface ISliderProps {
  open: boolean;
  title: string;
  position: SliderPosition;
  onClose: () => void;
}

interface IBaseSliderProps extends ISliderProps {
  children: JSX.Element;
}

const Slider = forwardRef<HTMLDivElement, IBaseSliderProps>((props, ref) => {
  const { open, title, position, children, onClose: parentClose } = props;

  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  const enableMapInteractions = useCallback(() => {
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.touchZoom.enable();
  }, [map]);

  const disableMapInteractions = useCallback(() => {
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
  }, [map]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    element.addEventListener("mouseenter", disableMapInteractions);
    element.addEventListener("mouseleave", enableMapInteractions);
    // For touch devices, pointerdown catches it before drag starts
    element.addEventListener("touchstart", disableMapInteractions);

    return () => {
      element.removeEventListener("mouseenter", disableMapInteractions);
      element.removeEventListener("mouseleave", enableMapInteractions);
      element.removeEventListener("touchstart", disableMapInteractions);
    };
  }, [enableMapInteractions, disableMapInteractions]);

  const onClose = useCallback(() => {
    enableMapInteractions();
    parentClose();
  }, [enableMapInteractions, parentClose]);

  return (
    <Slide
      ref={containerRef}
      direction={position === "right" ? "left" : "right"}
      in={open}
      mountOnEnter
      unmountOnExit
    >
      <SliderBase title={title} position={position} onClose={onClose} ref={ref}>
        {children}
      </SliderBase>
    </Slide>
  );
});

export default Slider;
