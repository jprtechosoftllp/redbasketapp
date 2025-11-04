import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubCategoryState {
  list: SubCategoryType[];
}

export const initialState: SubCategoryState = {
  list: [],
};

const subCategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSubCategory: (state, action: PayloadAction<SubCategoryType[]>) => {
      state.list = action.payload;
    },
    addSubCategory: (state, action: PayloadAction<SubCategoryType>) => {
      state.list.push(action.payload);
    },
    updateSubCategory: (state, action: PayloadAction<SubCategoryType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setSubCategory, addSubCategory, updateSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
