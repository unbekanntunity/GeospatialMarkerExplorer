import { useContext } from "react";

import SliderContext from "../SliderContext";

export const useSlider = () => {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error("useSlider must be used inside SliderProvider");
  }

  return context;
};
