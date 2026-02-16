import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DetailsInfoInterface from '../interfaces/details_info';
import HeaderInfoInterface from '../interfaces/header_Info';
import { CVState, Theme } from './cvTypes';

const initialState: CVState = {
  header: {
    about_info: { title: '', description: '' },
    contact_info: { 
      email: [], 
      phone_number: [], 
      address: { street_name: '', ext_number: '', city: '', state: '', country: '' } 
    },
    personal_info: { name: '', lastname: '', second_lastname: '', birthdate: '' },
    social_media: [],
  },
  details: {
    abilities: [],
    education: [],
    experience: [],
    interests: [],
    languages: [],
    picture: '',
    projects: [],
  },
  isLoading: false,
  error: null,
  theme: 'simple',
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCVData: (
      state,
      action: PayloadAction<{ header: HeaderInfoInterface; details: DetailsInfoInterface }>
    ) => {
      state.header = action.payload.header;
      state.details = action.payload.details;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'simple' ? 'bootstrap' : 'simple';
    },
    clearCVData: () => initialState,
  },
});

export const { setCVData, setLoading, setError, setTheme, toggleTheme, clearCVData } = cvSlice.actions;
export default cvSlice.reducer;
