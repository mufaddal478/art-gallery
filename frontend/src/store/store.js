import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import artworkReducer from './slices/artworkSlice';
import userReducer from './slices/userSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artworks: artworkReducer,
    users: userReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
