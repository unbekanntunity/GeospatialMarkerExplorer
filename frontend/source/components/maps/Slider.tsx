import { Slide } from "@mui/material";
import { forwardRef, JSX } from "react";

import { SliderPosition } from "../sliders/SliderAction";
import SliderBase from "./SliderBase";

interface ISliderProps {
  open: boolean;
  title: string;
  position: SliderPosition;
  children: JSX.Element;
  onClose: () => void;
}

const Slider = forwardRef<HTMLDivElement, ISliderProps>((props, ref) => {
  const { open, title, position, children, onClose } = props;

  return (
    <Slide
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
