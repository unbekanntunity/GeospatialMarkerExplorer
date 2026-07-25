import { NONE_SELECTED } from "../../../../constants";

export interface IFormState {
  name: string;
  description: string | null;
  icon_url: string | null;
}

export const defaultFormState = {
  name: "",
  description: "",
  icon_url: NONE_SELECTED
};
