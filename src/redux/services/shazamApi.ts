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
    getTrackSimilarities: builder.query<ShazamSong[], string>({
      query: (id) => ({
        url: '/shazam-songs/list-similarities',
        params: {
          id: `track-similarities-id-${id}`,
        },
      }),
      transformResponse: (response: ShazamSongsListSimilarities) =>
        Object.values(response.resources['shazam-songs']),
    }),
    getArtistTopSongs: builder.query<ShazamSong[], string>({
      query: (id) => ({
        url: '/artists/get-top-songs',
        params: {
          id,
        },
      }),
      transformResponse: (response: ArtistsTopSongs) =>
        Object.values(
          response.data.map(
            (d) =>
              ({
                id: d.id,
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
                  artists: {
                    data: [
                      {
                        id: d.id,
                        type: DatumType.Artists,
                      },
                    ],
                  },
                } as unknown as ShazamSongRelationships,
              }) as ShazamSong,
          ),
        ),
    }),
  }),
});

export const { useGetTrackSimilaritiesQuery, useGetArtistTopSongsQuery } =
  shazamApi;
