import { createContext, Dispatch } from "react";

import { IModalState, ModalReducerAction } from "./ModalAction";

interface IModalContext {
  state: IModalState;
  dispatch: Dispatch<ModalReducerAction>;
}

export default createContext<IModalContext | undefined>(undefined);
