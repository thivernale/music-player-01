import { SongBar } from './index';
import { NormalizedSong, SongHandler } from '../types/normalized';

interface RelatedSongsProps {
  data?: NormalizedSong[];
  activeSong?: NormalizedSong;
  isPlaying?: boolean;
  handlePlay?: SongHandler;
  handlePause?: SongHandler;
}

const RelatedSongs = ({
  activeSong,
  isPlaying,
  data,
  handlePlay,
  handlePause,
}: RelatedSongsProps) => (
  <div className="flex flex-col">
    <h1 className="text-3xl font-bold text-white">Related Songs:</h1>
    <div className="mt-6 flex w-full flex-col">
      {data?.map((song, i) => (
        <SongBar
          key={song.id}
          song={song}
          i={i}
          handlePlay={handlePlay}
          handlePause={handlePause}
          activeSong={activeSong}
          isPlaying={isPlaying}
        />
      ))}
    </div>
  </div>
);

export default RelatedSongs;
