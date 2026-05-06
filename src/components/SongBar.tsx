import { Link } from 'react-router-dom';
import PlayPause from './PlayPause';
import { NormalizedSong, SongHandler } from '../types/normalized';

interface Props {
  song: NormalizedSong;
  i: number;
  activeSong?: NormalizedSong;
  isPlaying?: boolean;
  handlePlay?: SongHandler;
  handlePause?: SongHandler;
}

const SongBar = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePause,
  handlePlay,
}: Props) => (
  <div
    className={`flex w-full flex-row items-center hover:bg-[#4c426e] ${activeSong?.id === song.id ? 'bg-[#4c426e]' : 'bg-transparent'} mb-2 cursor-pointer rounded-lg p-4 py-2`}
  >
    <h3 className="mr-3 text-base font-bold text-white">{i + 1}.</h3>
    <div className="flex flex-1 flex-row items-center justify-between">
      <img
        className="h-20 w-20 rounded-lg"
        src={song.coverArt}
        alt={song.title}
      />
      <div className="mx-3 flex flex-1 flex-col justify-center">
        {song.detailRoute ? (
          <Link to={`${song.detailRoute}/${song.id}`}>
            <p className="text-xl font-bold text-white">{song.title}</p>
          </Link>
        ) : (
          <p className="text-xl font-bold text-white">{song.title}</p>
        )}
        <p className="mt-1 text-base text-gray-300">
          {song.artistId ? (
            <Link to={`/artists/${song.artistId}`}>{song.artist}</Link>
          ) : (
            song.artist
          )}
        </p>
      </div>
    </div>
    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeSong}
      song={song}
      handlePause={() => handlePause?.(song, i)}
      handlePlay={() => handlePlay?.(song, i)}
    />
  </div>
);

export default SongBar;
