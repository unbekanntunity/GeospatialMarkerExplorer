import { Slide } from "@mui/material";
import { forwardRef, JSX } from "react";

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
