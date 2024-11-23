import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  artworks: [],
  artwork: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get all artworks
export const getArtworks = createAsyncThunk(
  'artworks/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/api/artworks');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get featured artworks
export const getFeaturedArtworks = createAsyncThunk(
  'artworks/getFeatured',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/api/artworks/featured');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get artwork details
export const getArtworkDetails = createAsyncThunk(
  'artworks/getDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/artworks/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add artwork
export const addArtwork = createAsyncThunk(
  'artworks/add',
  async (artworkData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://localhost:5000/api/artworks', artworkData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update artwork
export const updateArtwork = createAsyncThunk(
  'artworks/update',
  async ({ id, artworkData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`http://localhost:5000/api/artworks/${id}`, artworkData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete artwork
export const deleteArtwork = createAsyncThunk(
  'artworks/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/artworks/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add review
export const addReview = createAsyncThunk(
  'artworks/addReview',
  async ({ artworkId, reviewData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`http://localhost:5000/api/artworks/${artworkId}/reviews`, reviewData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const artworkSlice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    reset: (state) => {
      state.artworks = [];
      state.artwork = null;
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArtworks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getArtworks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.artworks = Array.isArray(action.payload) ? action.payload : [];
        state.message = '';
      })
      .addCase(getArtworks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.artworks = [];
      })
      .addCase(getFeaturedArtworks.fulfilled, (state, action) => {
        state.artworks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getArtworkDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArtworkDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artwork = action.payload;
      })
      .addCase(getArtworkDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addArtwork.fulfilled, (state, action) => {
        state.artworks.push(action.payload);
      })
      .addCase(updateArtwork.fulfilled, (state, action) => {
        const index = state.artworks.findIndex(
          (artwork) => artwork._id === action.payload._id
        );
        if (index !== -1) {
          state.artworks[index] = action.payload;
        }
        if (state.artwork?._id === action.payload._id) {
          state.artwork = action.payload;
        }
      })
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        state.artworks = state.artworks.filter(
          (artwork) => artwork._id !== action.payload
        );
        if (state.artwork?._id === action.payload) {
          state.artwork = null;
        }
      })
      .addCase(addReview.fulfilled, (state, action) => {
        if (state.artwork?._id === action.payload._id) {
          state.artwork = action.payload;
        }
        const index = state.artworks.findIndex(
          (artwork) => artwork._id === action.payload._id
        );
        if (index !== -1) {
          state.artworks[index] = action.payload;
        }
      });
  },
});

export const { reset } = artworkSlice.actions;
export default artworkSlice.reducer;
