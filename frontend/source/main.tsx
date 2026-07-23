import "./api/config";
import "leaflet/dist/leaflet.css";

import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { ModalProvider } from "./components/modals/SliderContextProvider";
import { SliderProvider } from "./components/sliders/SliderContextProvider";
import { defaultTheme } from "./themes/defaultTheme";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <ModalProvider>
          <SliderProvider>
            <App />
          </SliderProvider>
        </ModalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
