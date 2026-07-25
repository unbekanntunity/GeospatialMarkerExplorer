import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import L from "leaflet";
import { forwardRef, JSX, useCallback, useEffect, useRef } from "react";

import { SliderPosition } from "../sliders/SliderAction";

interface ISliderProps {
  title: string;
  position: SliderPosition;
  children: JSX.Element;
  onClose: () => void;
}

const SliderBase = forwardRef<HTMLDivElement, ISliderProps>((props, ref) => {
  const { title, position, children, onClose } = props;

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      sliderRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  useEffect(() => {
    if (!sliderRef.current) {
      return;
    }

    L.DomEvent.disableScrollPropagation(sliderRef.current);
  }, []);

  return (
    <Box
      ref={setRefs}
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: position === "left" ? 0 : "unset",
        right: position === "right" ? 0 : "unset",
        width: "25vw",
        zIndex: 1000
      }}
    >
      <Paper
        sx={{
          border: "4px solid yellow",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.secondary.main,
            p: 2
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
          <IconButton color="primary" onClick={onClose}>
            <ClearOutlinedIcon />
          </IconButton>
        </Box>
        {children}
      </Paper>
    </Box>
  );
});

export default SliderBase;
