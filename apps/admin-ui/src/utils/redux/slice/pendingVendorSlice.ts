import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './activeVendorSlice';

const pendingVendorSlice = createSlice({
  name: "active-vendor",
  initialState,
  reducers: {
    setPendingVendor: (state, action: PayloadAction<VendorDataType[]>) => {
      state.list = action.payload;
    },
    addPendingVendor: (state, action: PayloadAction<VendorDataType>) => {
      state.list.push(action.payload);
    },
    updatePendingVendor: (state, action: PayloadAction<VendorDataType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setPendingVendor, addPendingVendor, updatePendingVendor } = pendingVendorSlice.actions;
export default pendingVendorSlice.reducer;
