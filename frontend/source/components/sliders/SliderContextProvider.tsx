import { ReactNode, useReducer } from "react";

import { sliderReducer } from "./SliderAction";
import SliderContext from "./SliderContext";

export const SliderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(sliderReducer, {});

  return (
    <SliderContext.Provider value={{ state, dispatch }}>
      {children}
    </SliderContext.Provider>
  );
};
