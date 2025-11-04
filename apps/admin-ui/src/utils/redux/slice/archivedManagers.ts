import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ManagerState {
  list: ManagerDataType[];
}

export const initialState: ManagerState = {
  list: [],
};

const archiveManagerSlice = createSlice({
  name: "archive-managers",
  initialState,
  reducers: {
    setArchiveManager: (state, action: PayloadAction<ManagerDataType[]>) => {
      state.list = action.payload;
    },
    addArchiveManager: (state, action: PayloadAction<ManagerDataType>) => {
      state.list.push(action.payload);
    },
    updateArchiveManager: (state, action: PayloadAction<ManagerDataType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setArchiveManager, addArchiveManager, updateArchiveManager } = archiveManagerSlice.actions;
export default archiveManagerSlice.reducer;
