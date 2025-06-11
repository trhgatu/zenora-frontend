// Define the interface for location data (adjust based on your API response)
interface Location {
  id: string;
  name: string;
}

interface LocationState {
  provinces: Location[];
  districts: Location[];
  loadingProvinces: boolean;
  loadingDistricts: boolean;
  error: string | null;
}

const initialState: LocationState = {
  provinces: [],
  districts: [],
  loadingProvinces: false,
  loadingDistricts: false,
  error: null,
};

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProvinces, fetchDistricts } from '../services/locationAPI';

export const getProvinces = createAsyncThunk(
  'location/getProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProvinces();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi lấy danh sách tỉnh/thành');
    }
  }
);

export const getDistricts = createAsyncThunk(
  'location/getDistricts',
  async (provinceId: string, { rejectWithValue }) => {
    try {
      const data = await fetchDistricts(provinceId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Lỗi khi lấy danh sách quận/huyện');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearDistricts: (state) => {
      state.districts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProvinces.pending, (state) => {
        state.loadingProvinces = true;
        state.error = null;
      })
      .addCase(getProvinces.fulfilled, (state, action) => {
        state.loadingProvinces = false;
        state.provinces = action.payload as Location[];
      })
      .addCase(getProvinces.rejected, (state, action) => {
        state.loadingProvinces = false;
        state.error = action.payload as string;
      })
      .addCase(getDistricts.pending, (state) => {
        state.loadingDistricts = true;
        state.error = null;
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.loadingDistricts = false;
        state.districts = action.payload as Location[];
      })
      .addCase(getDistricts.rejected, (state, action) => {
        state.loadingDistricts = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDistricts } = locationSlice.actions;
export default locationSlice.reducer;