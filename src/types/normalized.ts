export interface NormalizedSong {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  coverArt: string;
  previewUrl: string;
  detailRoute?: '/tracks';
}

export type SongHandler = (song: NormalizedSong, i: number) => void;

export interface NormalizedArtistDetails {
  id: string;
  name: string;
  avatar?: string;
}
