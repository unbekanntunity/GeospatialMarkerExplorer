import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Toolbar,
  useTheme
} from "@mui/material";
import { JSX, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface IModalProps {
  title: string;
  confirmText: string;
  children: JSX.Element;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

const Modal = (props: IModalProps) => {
  const { title, children, confirmText, onConfirm, onClose } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();

  const handleConfirm = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }, [onConfirm, onClose]);

  return (
    <Dialog fullWidth open={true}>
      <Toolbar disableGutters>
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <DialogTitle>{title}</DialogTitle>
          <div>
            <Button
              aria-label="cancel-button"
              color="primary"
              key="cancel"
              variant="contained"
              onClick={onClose}
            >
              {t("general.cancel")}
            </Button>
            <Button
              sx={{ mx: 2 }}
              color="error"
              key="delete"
              aria-label="delete-button"
              variant="contained"
              onClick={handleConfirm}
              startIcon={
                isSubmitting ? <CircularProgress size="0.9em" /> : undefined
              }
              disabled={isSubmitting}
            >
              {confirmText}
            </Button>
          </div>
        </Box>
      </Toolbar>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
