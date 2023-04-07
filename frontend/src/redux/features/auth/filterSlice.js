import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredKeys: [],
  sortingByDate: "desc",
  sortingByEmail: "desc",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_KEYS(state, action) {
      const { keys, search } = action.payload;
      const tempKeys = keys.filter(
        (key) =>
          key.good.toLowerCase().includes(search.toLowerCase()) ||
          key.email.toLowerCase().includes(search.toLowerCase())
      );
      state.filteredKeys = tempKeys;
    },
    DELETE_FILTERED_KEYS(state) {
      state.filteredKeys = [];
    },
    SORT_KEY_BY_DATE(state, action) {
      console.log(action.payload);
      if (action.payload === "asc") {
        const sorted = state.filteredKeys.sort(
          (a, b) => a.saleDate - b.saleDate
        );

        state.filteredKeys = sorted;
        state.sortingByDate = "asc";
      }
      if (action.payload === "desc") {
        const sorted = state.filteredKeys.sort(
          (a, b) => b.saleDate - a.saleDate
        );
        state.filteredKeys = sorted;
        state.sortingByDate = "desc";
      }
    },
    SORT_KEY_BY_EMAIL(state, action) {
      console.log(action.payload);
      if (action.payload === "asc") {
        const sorted = state.filteredKeys.sort((a, b) =>
          a.email.localeCompare(b.email)
        );

        state.filteredKeys = sorted;
        state.sortingByEmail = "asc";
      }
      if (action.payload === "desc") {
        const sorted = state.filteredKeys.sort((a, b) =>
          b.email.localeCompare(a.email)
        );

        state.filteredKeys = sorted;
        state.sortingByEmail = "desc";
      }
    },
  },
});

export const {
  DELETE_FILTERED_KEYS,
  FILTER_KEYS,
  SORT_KEY_BY_DATE,
  SORT_KEY_BY_EMAIL,
} = filterSlice.actions;
export const selectKeys = (state) => state.filter.filteredKeys;

export default filterSlice.reducer;
