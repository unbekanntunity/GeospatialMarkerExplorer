import { useCallback, useState } from "react";
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

  const [formState, setFormState] = useState<IFormState>({
    name: category.name,
    description: category.description,
    icon_url: category.icon_url
  });

  const { t } = useTranslation();

  const updateCategory = useUpdateCategory();

  const onConfirm = useCallback(async () => {
    await updateCategory.mutateAsync({
      id: category.id,
      category: formState
    });
  }, [formState, category, updateCategory]);

  return (
    <CategoryModal
      formState={formState}
      setFormState={setFormState}
      title={t("createCategoryModal.title")}
      submitText={t("general.create")}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
};

export default EditCategoryModal;
