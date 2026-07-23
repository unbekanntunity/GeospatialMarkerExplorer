import { createTheme } from "@mui/material";

export const defaultTheme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#fff",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff"
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD600"
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD600"
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fff",

          "&.Mui-focused": {
            color: "#FFD600"
          }
        }
      }
    },
    MuiAlert: {
      variants: [
        {
          props: { severity: "error" },
          style: {
            backgroundColor: "#f53a10",
            color: "#000",

            "& .MuiAlert-icon": {
              color: "#000"
            }
          }
        }
      ]
    }
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#000000",
      light: "#333333"
    },
    secondary: {
      main: "#ffed00"
    },
    error: {
      main: "#f53a10"
    }
  }
});
