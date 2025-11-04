import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CategoryState {
  list: CategoryType[];
}

export const initialState: CategoryState = {
  list: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CategoryType[]>) => {
      state.list = action.payload;
    },
    addCategory: (state, action: PayloadAction<CategoryType>) => {
      state.list.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<CategoryType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setCategory, addCategory, updateCategory } = categorySlice.actions;
export default categorySlice.reducer;
