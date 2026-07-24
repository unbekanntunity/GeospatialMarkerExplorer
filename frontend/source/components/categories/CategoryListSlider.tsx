import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { CategoryResponse } from "../../api/generated";
import { useCategories, useDeleteCategory } from "../../models/CategoryModel";
import { isDefaultCategory } from "../../utils/CategoryUtils";
import Slider from "../maps/Slider";
import { useModal } from "../modals/hooks/useModal";
import { ModalAction } from "../modals/ModalAction";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";

interface ICategoryListSliderProps {
  open: boolean;
  position: SliderPosition;
}

const CategoryListSlider = (props: ICategoryListSliderProps) => {
  const { open, position } = props;

  const { dispatch: sliderDispatch } = useSlider();
  const { state: modalState, dispatch: modalDispatch } = useModal();

  const { data: categories, isFetching } = useCategories({});
  const deleteCategory = useDeleteCategory();

  const { t } = useTranslation();

  const onClose = useCallback(() => {
    sliderDispatch({
      type: SliderAction.HideSlider,
      slider: "categoryListSlider"
    });
  }, [sliderDispatch]);

  const onEdit = useCallback(
    (
      event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      category: CategoryResponse
    ) => {
      event.stopPropagation();

      modalDispatch({
        type: ModalAction.ShowModal,
        modal: "editCategoryModal",
        payload: {
          category
        }
      });
    },
    [modalDispatch]
  );

  const onDelete = useCallback(
    (
      event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      category: CategoryResponse
    ) => {
      event.stopPropagation();

      modalDispatch({
        type: ModalAction.ShowModal,
        modal: "confirmDeleteModal",
        payload: {
          entityName: category.name,
          onConfirm: () => deleteCategory.mutateAsync(category.id)
        }
      });
    },
    [deleteCategory, modalDispatch]
  );

  return (
    <Slider
      title={t("categoryListSlider.title")}
      open={open}
      position={position}
      onClose={onClose}
    >
      {!isFetching ? (
        <List>
          {categories ? (
            categories?.map((category) => (
              <ListItem
                key={category.id}
                secondaryAction={
                  <>
                    <IconButton
                      color={
                        !!modalState.editCategoryModal &&
                        modalState.editCategoryModal.category.id === category.id
                          ? "secondary"
                          : "inherit"
                      }
                      component="span"
                      onClick={(e) => onEdit(e, category)}
                    >
                      <CreateOutlinedIcon />
                    </IconButton>
                    {!isDefaultCategory(category.icon_url) && (
                      <IconButton
                        component="span"
                        onClick={(e) => onDelete(e, category)}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    )}
                  </>
                }
              >
                {category.icon_url && (
                  <ListItemAvatar>
                    <Avatar>
                      <img src={category.icon_url} />
                    </Avatar>
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={category.name}
                  secondary={category.description}
                />
              </ListItem>
            ))
          ) : (
            <Typography>{t("categoryListSlider.empty")}</Typography>
          )}
        </List>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      )}
    </Slider>
  );
};

export default CategoryListSlider;
