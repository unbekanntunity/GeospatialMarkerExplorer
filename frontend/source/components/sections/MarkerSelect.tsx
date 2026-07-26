import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Grow,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  TextField,
  useTheme
} from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import { MarkerResponse } from "../../api/generated";
import { useMarkers } from "../../models/MarkerModel";
import { stringsByAlphabet } from "../../utils/StringUtils";
import { useSlider } from "../sliders/hooks/useSliders";
import { SliderAction } from "../sliders/SliderAction";

interface IMarkerSelectProps {
  onChangeMarker: (newMarker: MarkerResponse[]) => void;
  selectedMarker: MarkerResponse[];
}

const MarkerSelect = (props: IMarkerSelectProps) => {
  const { onChangeMarker, selectedMarker } = props;

  const { data: markers, isFetching: isFetchingMarkers } = useMarkers({});

  const [query, setQuery] = useState("");
  const [showAutocompleteList, setShowAutocompleteList] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { dispatch } = useSlider();
  const theme = useTheme();

  const trimmedQuery = useMemo(() => query.replace(/^\s+|\s+$/g, ""), [query]);

  const sortedAvailableMarkers = useMemo(
    () => markers?.sort((a, b) => stringsByAlphabet(a.name, b.name)),
    [markers]
  );

  const filteredMarkers = useMemo(() => {
    const searchQueries = trimmedQuery.toLowerCase().split(" ");
    return sortedAvailableMarkers?.filter((availableMarkers) =>
      searchQueries.every((searchQuery) =>
        availableMarkers.name.toLowerCase().includes(searchQuery)
      )
    );
  }, [sortedAvailableMarkers, trimmedQuery]);

  const matchingMarker = useMemo(
    () => filteredMarkers?.find((marker) => marker.name.includes(trimmedQuery)),
    [filteredMarkers, trimmedQuery]
  );

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const clearQuery = useCallback(() => {
    setQuery("");
  }, []);

  const onClickInput = useCallback(() => {
    setShowAutocompleteList(true);
  }, []);

  const onAutocompleteClickAway = useCallback((e: MouseEvent | TouchEvent) => {
    if (e.target !== inputRef.current) {
      setShowAutocompleteList(false);
    }
  }, []);

  const toggleMarker = useCallback(
    (marker: MarkerResponse) => {
      const alreadySelected = selectedMarker
        .map((m) => m.id)
        .includes(marker.id);

      onChangeMarker(
        alreadySelected
          ? selectedMarker.filter((m) => m.id !== marker.id)
          : [...selectedMarker, marker]
      );
    },
    [selectedMarker, onChangeMarker]
  );

  const onKeyDownInput = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (matchingMarker) {
          toggleMarker(matchingMarker);
        }
      }
    },
    [matchingMarker, toggleMarker]
  );

  const onAddMarker = useCallback(() => {
    dispatch({
      type: SliderAction.ShowSlider,
      slider: "createMarkerSlider",
      payload: {
        position: "left"
      }
    });
  }, [dispatch]);

  const onDropMarker = useCallback(
    (markerId: string) => {
      onChangeMarker(selectedMarker.filter((m) => m.id !== markerId));
    },
    [selectedMarker, onChangeMarker]
  );

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        value={query}
        onChange={onChangeInput}
        onClick={onClickInput}
        onKeyDown={onKeyDownInput}
        inputRef={inputRef}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="clear" onClick={clearQuery} edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
      <Popper
        style={{ zIndex: 2000 }}
        open={inputRef.current ? showAutocompleteList : false}
        anchorEl={inputRef.current}
        transition
        placement="top-start"
        popperOptions={{
          modifiers: [
            {
              name: "flip",
              enabled: false
            },
            { name: "preventOverflow", enabled: false }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper
              sx={{
                border: `1px solid ${theme.palette.secondary.main}`,
                maxHeight: "250px",
                overflow: "auto"
              }}
            >
              <ClickAwayListener onClickAway={onAutocompleteClickAway}>
                <List aria-label="tag-list">
                  {!isFetchingMarkers ? (
                    filteredMarkers?.map((marker) => (
                      <ListItem
                        key={marker.id}
                        dense
                        onClick={() => toggleMarker(marker)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedMarker
                              ?.map((m) => m.id)
                              .includes(marker.id)}
                          />
                        </ListItemIcon>
                        <ListItemText primary={marker.name} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <CircularProgress color="secondary" size="0.9em" />
                    </ListItem>
                  )}
                  <ListItem
                    key="add"
                    dense
                    sx={{
                      justifyContent: "center"
                    }}
                  >
                    <IconButton onClick={onAddMarker}>
                      <AddOutlinedIcon />
                    </IconButton>
                  </ListItem>
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {selectedMarker.length !== 0 && (
        <Box sx={{ mt: 1, border: "1px solid white" }}>
          {selectedMarker.map((marker) => (
            <Chip
              sx={{ m: 2 }}
              key={marker.id}
              label={marker.name}
              onDelete={() => onDropMarker(marker.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MarkerSelect;
