import { ShazamSong } from '../types/shazamSongsListSimilarities';
import { NormalizedSong } from '../types/normalized';
import { ArtistSong } from '../types/search2';

export function formatAppleArtworkUrl(url: string, size = 250): string {
  return url?.replace('{w}', String(size)).replace('{h}', String(size)) ?? '';
}

export function normalizeShazamSong(song: ShazamSong): NormalizedSong {
  return {
    id: song.id,
    title: song.attributes.title,
    artist: song.attributes.artist,
    artistId: song.relationships?.artists?.data[0]?.id,
    coverArt: song.attributes.images?.coverArt ?? '',
    previewUrl: song.attributes.streaming?.preview ?? '',
    detailRoute: '/tracks',
  };
}

export function normalizeAppleSong(
  song: ArtistSong,
  artistId?: string,
): NormalizedSong {
  return {
    id: song.id,
    title: song.attributes.name,
    artist: song.attributes.artistName,
    artistId,
    coverArt: formatAppleArtworkUrl(song.attributes.artwork?.url),
    previewUrl: song.attributes.previews[0]?.url ?? '',
  };
}
