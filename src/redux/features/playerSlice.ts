import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShazamSong, ShazamSongAttributes } from '../../types/apiTypes';

const initialState = {
  currentSongs: [] as ShazamSong[],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {} as ShazamSong,
  genreListId: '',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (
      state,
      action: PayloadAction<{
        song: ShazamSong;
        data: ShazamSong[];
        i: number;
      }>,
    ) => {
      state.activeSong = action.payload.song;

      /*if (action.payload?.data?.tracks?.hits) {
        state.currentSongs = action.payload.data.tracks.hits;
      } else if (action.payload?.data?.properties) {
        state.currentSongs = action.payload?.data?.tracks;
      } else {
        state.currentSongs = action.payload.data;
      }*/
      state.currentSongs = action.payload.data;

      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    nextSong: (state, action: PayloadAction<number>) => {
      /*if (state.currentSongs[action.payload]?.attributes) {
        state.activeSong = state.currentSongs[action.payload]?.attributes;
      } else {
        state.activeSong = state.currentSongs[action.payload];
      }*/
      state.activeSong =
        state.currentSongs[action.payload] || ({} as ShazamSongAttributes);

      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action: PayloadAction<number>) => {
      /*if (state.currentSongs[action.payload]?.attributes) {
        state.activeSong = state.currentSongs[action.payload]?.attributes;
      } else {
        state.activeSong = {} as ShazamSongAttributes; //state.currentSongs[action.payload];
      }*/
      state.activeSong =
        state.currentSongs[action.payload] || ({} as ShazamSongAttributes);

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
