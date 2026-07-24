import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { CategoryResponse } from "../../../api/generated";
import { useUpdateCategory } from "../../../models/CategoryModel";
import CategoryModal from "./CategoryModal";
import { IFormState } from "./types/IFormState";

interface IEditCategoryModalProps {
  category: CategoryResponse;
  onClose: () => void;
}

const EditCategoryModal = (props: IEditCategoryModalProps) => {
  const { category, onClose } = props;

  const { t } = useTranslation();

  const updateCategory = useUpdateCategory();

  const onConfirm = useCallback(
    async (formState: IFormState) => {
      await updateCategory.mutateAsync({
        id: category.id,
        category: formState
      });
    },
    [category, updateCategory]
  );

  return (
    <CategoryModal
      category={category}
      title={t("createCategoryModal.title")}
      submitText={t("general.create")}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export default EditCategoryModal;
