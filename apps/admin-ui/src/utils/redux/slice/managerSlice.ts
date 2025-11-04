import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './archivedManagers'

const managerSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    setManager: (state, action: PayloadAction<ManagerDataType[]>) => {
      state.list = action.payload;
    },
    addManager: (state, action: PayloadAction<ManagerDataType>) => {
      state.list.push(action.payload);
    },
    updateManager: (state, action: PayloadAction<ManagerDataType>) => {
      const index = state.list.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setManager, addManager, updateManager } = managerSlice.actions;
export default managerSlice.reducer;
