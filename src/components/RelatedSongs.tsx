import { ShazamSong } from '../types/shazamSongsListSimilarities';
import { SongBar } from './index';
import { ArtistSong } from '../types/artistsTopSongs';

interface RelatedSongsProps {
  data?: ShazamSong[] | ArtistSong[];
  activeSong?: ShazamSong;
  isPlaying?: boolean;
  handlePlay?: (song: ShazamSong, i: number) => void;
  handlePause?: (song: ShazamSong, i: number) => void;
  artistId?: string;
}

const RelatedSongs = ({
  activeSong,
  isPlaying,
  data,
  handlePlay,
  handlePause,
  artistId,
}: RelatedSongsProps) => (
  <div className="flex flex-col">
    <h1 className="text-3xl font-bold text-white">Related Songs:</h1>
    <div className="mt-6 flex w-full flex-col">
      {!artistId
        ? ((data as ShazamSong[]) || []).map((song: ShazamSong, i: number) => (
            <SongBar
              key={song.id}
              song={song}
              i={i}
              handlePlay={handlePlay}
              handlePause={handlePause}
              activeSong={activeSong}
              isPlaying={isPlaying}
            />
          ))
        : ((data as ArtistSong[]) || []).map((song: ArtistSong, i: number) => (
            <SongBar key={song.id} song={song} artistId={artistId} i={i} />
          ))}
    </div>
  </div>
);

export default RelatedSongs;
