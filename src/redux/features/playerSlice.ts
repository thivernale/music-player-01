import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NormalizedSong } from '../../types/normalized';

const initialState = {
  currentSongs: [] as NormalizedSong[],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {} as NormalizedSong,
  genreListId: '',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (
      state,
      action: PayloadAction<{
        song: NormalizedSong;
        data: NormalizedSong[];
        i: number;
      }>,
    ) => {
      state.activeSong = action.payload.song;
      state.currentSongs = action.payload.data;
      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    nextSong: (state, action: PayloadAction<number>) => {
      state.activeSong =
        state.currentSongs[action.payload] || ({} as NormalizedSong);
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action: PayloadAction<number>) => {
      state.activeSong =
        state.currentSongs[action.payload] || ({} as NormalizedSong);
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    playPause: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    selectGenreListId: (state, action: PayloadAction<string>) => {
      state.genreListId = action.payload;
    },
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
} = playerSlice.actions;

export default playerSlice.reducer;
