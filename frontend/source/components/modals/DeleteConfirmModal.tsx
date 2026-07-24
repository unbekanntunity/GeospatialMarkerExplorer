import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import Modal from "./Modal";

interface IDeleteConfirmModalProps {
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

const DeleteConfirmModal = (props: IDeleteConfirmModalProps) => {
  const { onConfirm, onClose } = props;

  const { t } = useTranslation();

  return (
    <Modal
      title={t("confirmDeleteModal.title")}
      confirmText={t("confirmDeleteModal.confirmText")}
      confirmButtonColor="error"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <Typography
        sx={{
          whiteSpace: "pre-line"
        }}
      >
        {t(
          "Are you sure you want to delete this marker?\nThis action can not be undone!"
        )}
      </Typography>
    </Modal>
  );
};

export default DeleteConfirmModal;
