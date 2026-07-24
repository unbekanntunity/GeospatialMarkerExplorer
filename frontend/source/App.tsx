import "./App.css";

import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import { useModals } from "./components/modals/hooks/useModals";
import { ModalAction } from "./components/modals/ModalAction";
import MapPage from "./components/pages/MapPage";

const App = () => {
  const { state, dispatch } = useModals();

  return (
    <>
      <MapPage />
      {state.confirmDeleteModal && (
        <DeleteConfirmModal
          {...state.confirmDeleteModal}
          onClose={() =>
            dispatch({
              type: ModalAction.HideModal,
              modal: "confirmDeleteModal"
            })
          }
        />
      )}
    </>
  );
};

export default App;
