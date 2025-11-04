import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductState {
  list: CategoryType[];
}

export const initialState: ProductState = {
  list: [],
};

const productSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<CategoryType[]>) => {
      state.list = action.payload;
    },
    addProduct: (state, action: PayloadAction<CategoryType>) => {
      state.list.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<CategoryType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setProduct, addProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
