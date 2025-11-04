import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VendorState {
  list: VendorDataType[];
}

export const initialState: VendorState = {
  list: [],
};

const activeVendorSlice = createSlice({
  name: "active-vendor",
  initialState,
  reducers: {
    setActiveVendor: (state, action: PayloadAction<VendorDataType[]>) => {
      state.list = action.payload;
    },
    addActiveVendor: (state, action: PayloadAction<VendorDataType>) => {
      state.list.push(action.payload);
    },
    updateActiveVendor: (state, action: PayloadAction<VendorDataType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setActiveVendor, addActiveVendor, updateActiveVendor } = activeVendorSlice.actions;
export default activeVendorSlice.reducer;
