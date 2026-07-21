import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2"
    }
  }
});

const CustomAppBar = () => {
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
            <IconButton size="large" aria-label="markers" color="inherit">
              <OutlinedFlagIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Box>
  );
};

export default CustomAppBar;
