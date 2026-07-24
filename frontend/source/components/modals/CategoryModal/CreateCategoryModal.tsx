import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useCreateCategory } from "../../../models/CategoryModel";
import CategoryModal from "./CategoryModal";
import { IFormState } from "./types/IFormState";

interface ICreateCategoryModalProps {
  onClose: () => void;
}

const CreateCategoryModal = (props: ICreateCategoryModalProps) => {
  const { onClose } = props;

  const { t } = useTranslation();

  const createCategory = useCreateCategory();

  const onConfirm = useCallback(
    async (formState: IFormState) => {
      await createCategory.mutateAsync({
        ...formState,
        icon_url: formState.icon_url !== "none" ? formState.icon_url : null
      });
    },
    [createCategory]
  );

  return (
    <CategoryModal
      title={t("createCategoryModal.title")}
      submitText={t("general.create")}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export default CreateCategoryModal;
