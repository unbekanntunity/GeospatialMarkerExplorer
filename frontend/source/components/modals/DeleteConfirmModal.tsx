import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import Modal from "./Modal";

interface IDeleteConfirmModalProps {
  entityName: string;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

const DeleteConfirmModal = (props: IDeleteConfirmModalProps) => {
  const { entityName, onConfirm, onClose } = props;

  const { t } = useTranslation();

  return (
    <Modal
      title={t("confirmDeleteModal.title")}
      confirmText={t("confirmDeleteModal.confirmText")}
      confirmButtonColor="error"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <>
        <Typography
          sx={{
            whiteSpace: "pre-line"
          }}
        >
          {t("confirmDeleteModal.message", { entityName })}
        </Typography>
      </>
    </Modal>
  );
};

export default DeleteConfirmModal;
