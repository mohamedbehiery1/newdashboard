import { createSlice } from "@reduxjs/toolkit";

let preferences = createSlice({
  name: "preferences",
  initialState: {
    layoutDirection: localStorage.getItem("i18nextLng") === "ar-SA" ? "rtl" : "ltr",
  },
  reducers: {
    layoutDirectionChanged: (preferences, action) => {
      const { layoutDirection } = action.payload;
      preferences.layoutDirection = layoutDirection;
    },
  },
});

export const { layoutDirectionChanged } = preferences.actions;

export default preferences.reducer;
