import "./App.css";

import CreateCategoryModal from "./components/modals/CreateCategoryModal/CreateCategoryModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import { useModal } from "./components/modals/hooks/useModal";
import { ModalAction } from "./components/modals/ModalAction";
import MapPage from "./components/pages/MapPage";

const App = () => {
  const { state, dispatch } = useModal();

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
      {state.createCategoryModal && (
        <CreateCategoryModal
          {...state.createCategoryModal}
          onClose={() =>
            dispatch({
              type: ModalAction.HideModal,
              modal: "createCategoryModal"
            })
          }
        />
      )}
    </>
  );
};

export default App;
