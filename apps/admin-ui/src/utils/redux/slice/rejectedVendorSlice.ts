import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './activeVendorSlice';

const rejectedVendorSlice = createSlice({
  name: "rejected-vendor",
  initialState,
  reducers: {
    setRejectedVendor: (state, action: PayloadAction<VendorDataType[]>) => {
      state.list = action.payload;
    },
    addRejectedVendor: (state, action: PayloadAction<VendorDataType>) => {
      state.list.push(action.payload);
    },
    updateRejectedVendor: (state, action: PayloadAction<VendorDataType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { addRejectedVendor, setRejectedVendor, updateRejectedVendor } = rejectedVendorSlice.actions;
export default rejectedVendorSlice.reducer;
