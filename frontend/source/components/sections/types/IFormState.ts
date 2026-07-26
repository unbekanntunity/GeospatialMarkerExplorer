import { MarkerResponse } from "../../../api/generated";

export interface IFormState {
  name: string;
  description: string | null;
  markers: MarkerResponse[];
}

export const defaultFormState: IFormState = {
  name: "",
  description: "",
  markers: []
};
