import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VendorState {
  list: VendorDataType[];
}

const initialState: VendorState = {
  list: [],
};

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    setVendor: (state, action: PayloadAction<VendorDataType[]>) => {
      state.list = action.payload;
    },
    addvendor: (state, action: PayloadAction<VendorDataType>) => {
      state.list.push(action.payload);
    },
    updateVendor: (state, action: PayloadAction<VendorDataType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setVendor, addvendor, updateVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
