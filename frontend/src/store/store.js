import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import artworkReducer from './slices/artworkSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artworks: artworkReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
