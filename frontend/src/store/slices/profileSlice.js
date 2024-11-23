import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await axios.put('http://localhost:5000/api/profile', profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updatePassword = createAsyncThunk(
    'profile/updatePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await axios.put('http://localhost:5000/api/profile/password', passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'profile/updateAvatar',
    async (formData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await axios.put('http://localhost:5000/api/profile/avatar', formData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toggleFavorite = createAsyncThunk(
    'profile/toggleFavorite',
    async (artworkId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/profile/favorites/${artworkId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    profile: null,
    loading: false,
    error: null,
    message: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.message = 'Profile updated successfully';
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Password
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Avatar
            .addCase(updateAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.message = 'Avatar updated successfully';
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Toggle Favorite
            .addCase(toggleFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearMessage } = profileSlice.actions;
export default profileSlice.reducer;
