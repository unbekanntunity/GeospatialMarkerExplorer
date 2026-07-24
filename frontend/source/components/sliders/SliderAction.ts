import { MarkerResponse } from "../../api/generated";

export type SliderPosition = "left" | "right";

export interface ISliderState {
  createMarkerSlider?: {
    position: SliderPosition;
  };
  editMarkerSlider?: {
    position: SliderPosition;
    marker: MarkerResponse;
  };
  markerListSlider?: {
    position: SliderPosition;
  };
  categoryListSlider?: {
    position: SliderPosition;
  };
}

export enum SliderAction {
  ShowSlider,
  HideSlider
}

export type SliderKey = keyof ISliderState;

export type SliderReducerAction<K extends SliderKey = SliderKey> =
  | {
      type: SliderAction.ShowSlider;
      slider: K;
      payload: NonNullable<ISliderState[K]>;
    }
  | {
      type: SliderAction.HideSlider;
      slider: K;
    };

const removeSliderAtPosition = (
  state: ISliderState,
  position: SliderPosition
): ISliderState => {
  return Object.fromEntries(
    Object.entries(state).filter(([, slider]) => slider?.position !== position)
  ) as ISliderState;
};

export const sliderReducer = (
  state: ISliderState,
  action: SliderReducerAction
): ISliderState => {
  switch (action.type) {
    case SliderAction.ShowSlider:
      return {
        ...removeSliderAtPosition(state, action.payload.position),
        [action.slider]: action.payload
      };

    case SliderAction.HideSlider:
      return {
        ...state,
        [action.slider]: undefined
      };

    default:
      return state;
  }
};
