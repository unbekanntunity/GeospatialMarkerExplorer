import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCategories } from "../../models/CategoryModel";

interface ICategoryDropdown {
  categoryIds: string[];
  setCategoryIds: Dispatch<SetStateAction<string[]>>;
}

const CategoryDropdown = (props: ICategoryDropdown) => {
  const { categoryIds, setCategoryIds } = props;

  const { t } = useTranslation();
  const { data: categories, isFetching } = useCategories({});

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeCategory = useCallback(
    (categoryId: string) => {
      if (!categories) {
        return;
      }

      setCategoryIds((prev) =>
        categoryIds.includes(categoryId)
          ? prev.filter((p) => p !== categoryId)
          : [...prev, categoryId]
      );
    },
    [categories, categoryIds, setCategoryIds]
  );

  return (
    <Box
      sx={{
        border: "1px solid white",
        height: "100%"
      }}
    >
      <Button sx={{ height: "100%" }} variant="contained" onClick={handleClick}>
        {t("general.categories")}
        {anchorEl !== null ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Button>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <Paper>
          <MenuList>
            {isFetching ? (
              <CircularProgress />
            ) : categories === undefined || categories.length === 0 ? (
              <Typography>{t("categoryListSlider.empty")}</Typography>
            ) : (
              <FormGroup>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <FormControlLabel
                      onClick={(e) => e.stopPropagation()}
                      control={
                        <Checkbox
                          checked={categoryIds.includes(c.id)}
                          onChange={() => onChangeCategory(c.id)}
                        />
                      }
                      label={c.name}
                    />
                  </MenuItem>
                ))}
              </FormGroup>
            )}
          </MenuList>
        </Paper>
      </Popover>
    </Box>
  );
};

export default CategoryDropdown;
