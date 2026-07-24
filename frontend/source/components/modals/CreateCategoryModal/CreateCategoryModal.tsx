import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateCategory } from "../../../models/CategoryModel";
import { useImages, useUploadImage } from "../../../models/UploadModel";
import Modal from "../Modal";
import { IFormState } from "./types/IFormState";

interface ICreateCategoryModalProps {
  onClose: () => void;
}

const CreateCategoryModal = (props: ICreateCategoryModalProps) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const { data: images, isFetching: isFetchingImages } = useImages();
  const uploadImage = useUploadImage();
  const createCategory = useCreateCategory();

  const [formState, setFormState] = useState<IFormState>({
    name: "",
    description: "",
    icon_url: "none"
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

  const onUploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      uploadImage.mutate({ file });
    },
    [uploadImage]
  );

  const onChangeFile = useCallback((event: SelectChangeEvent) => {
    setFormState((prev) => ({
      ...prev,
      icon_url: event.target.value
    }));
  }, []);

  const onConfirm = useCallback(async () => {
    await createCategory.mutateAsync({ ...formState });
  }, [formState, createCategory]);

  return (
    <Modal
      title={t("createCategoryModal.title")}
      confirmText={t("general.confirm")}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Select value={formState.icon_url} onChange={onChangeFile}>
              <MenuItem key="none" value="none">
                {t("createCategoryModal.noImageSelected")}
              </MenuItem>
              {isFetchingImages && (
                <MenuItem disabled sx={{ justifySelf: "center" }}>
                  <CircularProgress color="secondary" size="0.9em" />{" "}
                </MenuItem>
              )}
              {!isFetchingImages &&
                images?.map((img) => (
                  <MenuItem key={img.url} value={img.url}>
                    {img.name}
                  </MenuItem>
                ))}
            </Select>
            <Typography>{t("or")}</Typography>
            <input
              id="upload-image"
              type="file"
              hidden
              onChange={onUploadFile}
              accept=".jpg,.jpeg,.png,.webp"
            />

            <label htmlFor="upload-image">
              <Button variant="contained" component="span">
                {t("createCategoryModal.uploadImage")}
              </Button>
            </label>
          </Box>
          <Box
            sx={{
              mt: 2,
              border: "1px solid white",
              borderRadius: "2px",
              display: "flex",
              justifyContent: "center",
              height: "200px",
              width: "100%"
            }}
          >
            {formState.icon_url !== "none" ? (
              <img
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain"
                }}
                src={formState.icon_url}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateCategoryModal;
