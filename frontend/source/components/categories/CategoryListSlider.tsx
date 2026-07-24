import {
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useCategories } from "../../models/CategoryModel";
import Slider from "../maps/Slider";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction, SliderPosition } from "../sliders/SliderAction";

interface ICategoryListSliderProps {
  open: boolean;
  position: SliderPosition;
}

const CategoryListSlider = (props: ICategoryListSliderProps) => {
  const { open, position } = props;

  const { dispatch } = useSlider();
  const { data: categories, isFetching } = useCategories({});

  const { t } = useTranslation();

  const onClose = useCallback(() => {
    dispatch({
      type: SliderAction.HideSlider,
      slider: "categoryListSlider"
    });
  }, [dispatch]);

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
              <ListItem>
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
        <CircularProgress />
      )}
    </Slider>
  );
};

export default CategoryListSlider;
