import { Alert, Box, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import Modal from "../Modal";
import ImageSelector from "./ImageSelector";
import { IFormState } from "./types/IFormState";

interface ICategoryModalProps {
  errorMessage?: string;
  formState: IFormState;
  setFormState: Dispatch<SetStateAction<IFormState>>;
  title: string;
  submitText: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

const CategoryModal = (props: ICategoryModalProps) => {
  const {
    errorMessage,
    formState,
    setFormState,
    title,
    submitText,
    onConfirm,
    onClose
  } = props;

  const { t } = useTranslation();

  const onChangeName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        name: event.target.value
      }));
    },
    [setFormState]
  );

  const onChangeDescription = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        description: event.target.value
      }));
    },
    [setFormState]
  );

  const onChangeIconUrl = useCallback(
    (newIconUrl: string | null) => {
      setFormState((prev) => ({
        ...prev,
        iconUrl: newIconUrl
      }));
    },
    [setFormState]
  );

  return (
    <Modal
      title={title}
      confirmText={submitText}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TextField
          label={t("category.name")}
          variant="outlined"
          value={formState.name}
          onChange={onChangeName}
        />
        <TextField
          label={t("category.description")}
          variant="outlined"
          value={formState.description}
          onChange={onChangeDescription}
          multiline
        />
        <ImageSelector
          iconUrl={formState.iconUrl}
          setIconUrl={onChangeIconUrl}
        />
        <Box sx={{ flex: 1 }} />
        {errorMessage && (
          <Alert sx={{ m: 4 }} severity="error">
            <Typography
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {errorMessage}
            </Typography>
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default CategoryModal;
