import "./App.css";

import ConfirmModal from "./components/modals/ConfirmModal";
import { useModals } from "./components/modals/hooks/useModals";
import { ModalAction } from "./components/modals/ModalAction";
import MapPage from "./pages/MapPage";

const App = () => {
  const { state, dispatch } = useModals();

  return (
    <>
      <MapPage />
      {state.confirmModal && (
        <ConfirmModal
          {...state.confirmModal}
          onClose={() =>
            dispatch({
              type: ModalAction.HideModal,
              modal: "confirmModal"
            })
          }
        />
      )}
    </>
  );
};

export default App;
