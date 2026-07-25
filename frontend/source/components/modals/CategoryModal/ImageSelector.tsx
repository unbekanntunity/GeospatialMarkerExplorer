import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { NONE_SELECTED } from "../../../constants";
import { useImages, useUploadImage } from "../../../models/UploadModel";

interface IImageSelectorProps {
  iconUrl: string | null;
  setIconUrl: (newUrl: string | null) => void;
}

const ImageSelector = (props: IImageSelectorProps) => {
  const { iconUrl, setIconUrl } = props;

  const { data: images, isFetching: isFetchingImages } = useImages();
  const uploadImage = useUploadImage();

  const { t } = useTranslation();

  const onUploadFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const uploadedImage = await uploadImage.mutateAsync({ file });

      setIconUrl(uploadedImage.name);
    },
    [uploadImage, setIconUrl]
  );

  const onChangeFile = useCallback(
    (event: SelectChangeEvent<string | null>) => {
      setIconUrl(
        event.target.value !== NONE_SELECTED ? event.target.value : null
      );
    },
    [setIconUrl]
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Select value={iconUrl} onChange={onChangeFile}>
          <MenuItem key={NONE_SELECTED} value={NONE_SELECTED}>
            {t("image.noneSelected")}
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
        <Typography>{t("general.or")}</Typography>
        <input
          id="upload-image"
          type="file"
          hidden
          onChange={onUploadFile}
          accept=".jpg,.jpeg,.png,.webp"
        />
        <label htmlFor="upload-image">
          <Button variant="contained" component="span">
            {t("category.uploadImage")}
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
        {iconUrl !== NONE_SELECTED && iconUrl !== null ? (
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain"
            }}
            src={iconUrl}
          />
        ) : null}
      </Box>
      {uploadImage.error && (
        <Alert sx={{ m: 4 }} severity="error">
          <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {t(`image.error.${uploadImage.error.name}`)}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ImageSelector;
