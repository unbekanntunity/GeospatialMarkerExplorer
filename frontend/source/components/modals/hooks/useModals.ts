import { useContext } from "react";

import ModalContext from "../ModalContext";

export const useModals = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModals must be used inside ModalProvider");
  }

  return context;
};
