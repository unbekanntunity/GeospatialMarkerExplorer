import { createContext, Dispatch } from "react";

import { ISliderState, SliderReducerAction } from "./SliderAction";

interface ISliderContext {
  state: ISliderState;
  dispatch: Dispatch<SliderReducerAction>;
}

export default createContext<ISliderContext | undefined>(undefined);
