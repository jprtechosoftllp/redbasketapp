import { configureStore } from '@reduxjs/toolkit';
import managerReducer from '../slice/managerSlice';
import archiveManagerReducer from '../slice/archivedManagers';
import activeVendorReducer from '../slice/activeVendorSlice'
import rejectedVendoReducer from '../slice/rejectedVendorSlice';
import pendingVendorReducer from '../slice/pendingVendorSlice';
import categoryReducer from '../slice/categorySlice';
import subCategoryReducer from '../slice/subCategorySlice';
import productReducer from '../slice/productSlice';

export const store = configureStore({
  reducer: {
    managers: managerReducer,
    archiveManager: archiveManagerReducer,
    activeVendor: activeVendorReducer,
    rejectedVendor: rejectedVendoReducer,
    pendingVendor: pendingVendorReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    product: productReducer,
    // other slices can be added here
  },
});

// Infer types for use across your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
