import { ReactNode, useReducer } from "react";

import { modalReducer } from "./ModalAction";
import ModalContext from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, {});

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
