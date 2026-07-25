import { CategoryResponse } from "../../../api/generated";

export interface IFormState {
  name: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  category: CategoryResponse | null;
}

export const defaultFormState = {
  name: "",
  description: "",
  latitude: 0,
  longitude: 0,
  category: null
};
