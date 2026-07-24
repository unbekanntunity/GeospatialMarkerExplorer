import { Box, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUploadImage } from "../../../models/UploadModel";
import Modal from "../Modal";
import { IFormState } from "./types/IFormState";

interface ICreateCategoryModalProps {
  onClose: () => void;
}

const CreateCategoryModal = (props: ICreateCategoryModalProps) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const uploadImage = useUploadImage();

  const [formState, setFormState] = useState<IFormState>({
    name: "",
    description: "",
    icon_url: ""
  });

  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        name: event.target.value
      }));
    },
    []
  );

  const onChangeDescription = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        description: event.target.value
      }));
    },
    []
  );

  const onChangeIconFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      uploadImage.mutate({ file });
    },
    [uploadImage]
  );

  return (
    <Modal
      title={t("createCategoryModal.title")}
      confirmText={t("general.confirm")}
      onConfirm={function (): Promise<unknown> {
        throw new Error("Function not implemented.");
      }}
      onClose={onClose}
    >
      <Box>
        <TextField
          label={t("createCategoryModal.name")}
          variant="outlined"
          value={formState.name}
          onChange={onChangeName}
        />
        <TextField
          label={t("createCategoryModal.description")}
          variant="outlined"
          value={formState.description}
          onChange={onChangeDescription}
          multiline
        />
        <input type="file" />
      </Box>
    </Modal>
  );
};

export default CreateCategoryModal;
