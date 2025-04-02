import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RAPIDAPI_KEY_HEADER, SHAZAM_API_BASE_URI } from './constants';
import {
  DatumType,
  Genres,
  Images,
  Share,
  ShazamSong,
  ShazamSongAttributes,
  ShazamSongRelationships,
  ShazamSongsListSimilarities,
  Streaming,
} from '../../types/shazamSongsListSimilarities';
import { ArtistsTopSongs } from '../../types/artistsTopSongs';
import { Search } from '../../types/search';
import {
  Resources,
  ShazamSongsGetDetails,
} from '../../types/shazamSongsGetDetails';
import { Attributes, SongsGetDetails } from '../../types/songsGetDetails';

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
    search: builder.query<Search, string>({
      query: (term) => ({
        url: '/search',
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
    getSongDetails: builder.query<Attributes, string>({
      query: (id) => ({
        url: '/songs/v2/get-details',
        params: { id },
      }),
      transformResponse: (response: SongsGetDetails) =>
        response.data[0].attributes || {},
    }),
    getArtistTopSongs: builder.query<ShazamSong[], string>({
      query: (id) => ({
        url: '/artists/get-top-songs',
        params: { id },
      }),
      transformResponse: (response: ArtistsTopSongs, meta, arg) =>
        Object.values(
          response.data.map(
            (d) =>
              ({
                id: d.id + 'not-shazam-song-id',
                type: DatumType.ShazamSongs,
                attributes: {
                  ...d.attributes,
                  type: 'MUSIC',
                  genres: { primary: d.attributes.genreNames[0] } as Genres,
                  title: d.attributes.name,
                  artist: d.attributes.artistName,
                  primaryArtist: d.attributes.artistName,
                  label: '',
                  explicit: false,
                  webUrl: d.attributes.url,
                  images: {
                    coverArt: d.attributes.artwork.url.replace(
                      /\{[wh]\}/g,
                      '400',
                    ),
                    artistAvatar: '',
                  } as Images,
                  share: {} as Share,
                  streaming: {
                    preview: d.attributes.previews[0].url,
                  } as Streaming,
                  classicalAvailability: false,
                } as ShazamSongAttributes,
                relationships: {
                  artists: { data: [{ id: arg, type: DatumType.Artists }] },
                  songs: { data: [{ id: d.id, type: DatumType.Songs }] },
                } as unknown as ShazamSongRelationships,
              }) as ShazamSong,
          ),
        ),
    }),
  }),
});

export const {
  useGetTrackDetailsQuery,
  useGetTrackSimilaritiesQuery,
  useGetArtistTopSongsQuery,
  useGetSongDetailsQuery,
} = shazamApi;
