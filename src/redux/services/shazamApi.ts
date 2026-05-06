import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RAPIDAPI_KEY_HEADER, SHAZAM_API_BASE_URI } from './constants';
import {
  ShazamSong,
  ShazamSongsListSimilarities,
} from '../../types/shazamSongsListSimilarities';
import { ArtistsTopSongs } from '../../types/artistsTopSongs';
import { Search2 } from '../../types/search2';
import {
  Resources,
  ShazamSongsGetDetails,
} from '../../types/shazamSongsGetDetails';
import {
  SongsGetDetails,
  SongsGetDetailsDatum,
} from '../../types/songsGetDetails';
import {
  ArtistAttributes,
  ArtistsGetDetails,
} from '../../types/artistsGetDetails';

export const shazamApi = createApi({
  reducerPath: 'shazamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SHAZAM_API_BASE_URI,
    prepareHeaders: (headers) => {
      headers.set(
        RAPIDAPI_KEY_HEADER,
        import.meta.env.VITE_SHAZAM_RAPIDAPI_KEY,
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    search: builder.query<Search2, string>({
      query: (term) => ({
        url: '/v2/search',
        params: { term, offset: 0, limit: 5 },
      }),
    }),
    getTrackDetails: builder.query<Resources, string>({
      query: (id) => ({
        url: '/shazam-songs/get-details',
        params: { id },
      }),
      transformResponse: (response: ShazamSongsGetDetails) =>
        response.resources || {},
    }),
    getTrackSimilarities: builder.query<ShazamSong[], string>({
      query: (id) => ({
        url: '/shazam-songs/list-similarities',
        params: { id: `track-similarities-id-${id}` },
      }),
      transformResponse: (response: ShazamSongsListSimilarities) =>
        Object.values(response.resources['shazam-songs']),
    }),
    getSongDetails: builder.query<SongsGetDetailsDatum, string>({
      query: (id) => ({
        url: '/songs/v2/get-details',
        params: { id },
      }),
      transformResponse: (response: SongsGetDetails) => response.data?.[0],
    }),
    getArtistDetails: builder.query<ArtistAttributes, string>({
      query: (id) => ({
        url: '/artists/get-details',
        params: { id },
      }),
      transformResponse: (response: ArtistsGetDetails) => {
        return response.data?.[0].attributes;
      },
    }),
    getArtistTopSongs: builder.query<ArtistsTopSongs, string>({
      query: (id) => ({
        url: '/artists/get-top-songs',
        params: { id },
      }),
    }),
  }),
});

export const {
  useGetTrackDetailsQuery,
  useGetTrackSimilaritiesQuery,
  useGetArtistDetailsQuery,
  useGetArtistTopSongsQuery,
  useGetSongDetailsQuery,
  useSearchQuery,
} = shazamApi;
