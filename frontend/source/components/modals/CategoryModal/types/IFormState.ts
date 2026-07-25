import { NONE_SELECTED } from "../../../../constants";

export interface IFormState {
  name: string;
  description: string | null;
  iconUrl: string | null;
}

export const defaultFormState = {
  name: "",
  description: "",
  iconUrl: NONE_SELECTED
};
