import { MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useCallback } from "react";

import i18n from "../../i18n";
import { languageIcons } from "../../types/Language";

const LanguagePicker = () => {
  const language = i18n.language;

  const getLanguageName = (lang: string) =>
    new Intl.DisplayNames([lang], {
      type: "language"
    }).of(lang);

  const onChangeLanguage = useCallback((event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  }, []);

  return (
    <Select
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "none"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none"
        }
      }}
      value={language}
      onChange={onChangeLanguage}
      renderValue={(selected) => (
        <img src={languageIcons[selected]} alt={selected} width={24} />
      )}
    >
      {Object.keys(languageIcons).map((l) => (
        <MenuItem key={l} value={l}>
          <img src={languageIcons[l]} alt={l} width={24} />
          <Typography sx={{ ml: 1 }}>{getLanguageName(l)}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguagePicker;
