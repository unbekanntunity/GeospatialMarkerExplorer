import {
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CategoryResponse } from "../../api/generated";
import { NONE_SELECTED } from "../../constants";
import { useCategories } from "../../models/CategoryModel";
import { stringsByAlphabet } from "../../utils/StringUtils";

interface ICategorySelect {
  category: CategoryResponse | null;
  setCategory: (newCategory: CategoryResponse | null) => void;
}

const CategorySelect = (props: ICategorySelect) => {
  const { category, setCategory } = props;

  const { t } = useTranslation();
  const { data: categories, isFetching: isFetchingCategories } = useCategories(
    {}
  );

  const sortedCategories = useMemo(
    () => categories?.sort((a, b) => stringsByAlphabet(a.name, b.name)),
    [categories]
  );

  const onChangeCategory = useCallback(
    (event: SelectChangeEvent<string | null>) => {
      const categoryId = event.target.value;
      const category = categories?.find((c) => c.id === categoryId);

      setCategory(category ?? null);
    },
    [categories, setCategory]
  );

  return (
    <Select
      MenuProps={{
        container: document.body
      }}
      value={category?.id ?? NONE_SELECTED}
      onChange={onChangeCategory}
    >
      <MenuItem key={NONE_SELECTED} value={NONE_SELECTED}>
        {t("category.noneSelected")}
      </MenuItem>
      {isFetchingCategories && (
        <MenuItem disabled sx={{ justifySelf: "center" }}>
          <CircularProgress color="secondary" size="0.9em" />{" "}
        </MenuItem>
      )}
      {!isFetchingCategories &&
        sortedCategories?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
    </Select>
  );
};

export default CategorySelect;
