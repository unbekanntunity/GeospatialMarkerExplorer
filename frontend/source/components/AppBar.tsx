import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

interface ICustomAppBarProps {
  isCreateMarkerSliderOpen?: boolean;
  isListMarkerSliderOpen?: boolean;
  onClickAddMarker?: () => void;
  onClickListMarker?: () => void;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2"
    }
  }
});

const CustomAppBar = (props: ICustomAppBarProps) => {
  const {
    isCreateMarkerSliderOpen,
    isListMarkerSliderOpen,
    onClickAddMarker,
    onClickListMarker
  } = props;

  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t("Geospatial Marker Explorer")}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="large"
              aria-label="add markers"
              color={isCreateMarkerSliderOpen ? "secondary" : "inherit"}
              onClick={onClickAddMarker}
            >
              <AddLocationAltOutlinedIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="markers"
              color={isListMarkerSliderOpen ? "secondary" : "inherit"}
              onClick={onClickListMarker}
            >
              <LocationOnOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Box>
  );
};

export default CustomAppBar;
