import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateCategory } from "../../../models/CategoryModel";
import CategoryModal from "./CategoryModal";
import { defaultFormState, IFormState } from "./types/IFormState";

interface ICreateCategoryModalProps {
  onClose: () => void;
}

const CreateCategoryModal = (props: ICreateCategoryModalProps) => {
  const { onClose: parentOnClose } = props;

  const [formState, setFormState] = useState<IFormState>(defaultFormState);

  const { t } = useTranslation();

  const createCategory = useCreateCategory();

  const onClose = useCallback(() => {
    setFormState(defaultFormState);

    parentOnClose();
  }, [parentOnClose]);

  const onConfirm = useCallback(async () => {
    await createCategory.mutateAsync({
      ...formState,
      icon_url: formState.iconUrl !== "none" ? formState.iconUrl : null
    });

    onClose();
  }, [formState, createCategory, onClose]);

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

export default CreateCategoryModal;
