import PlayPause from './PlayPause';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { NormalizedSong } from '../types/normalized';

interface Props {
  song: NormalizedSong;
  i: number;
  activeSong?: NormalizedSong;
  isPlaying?: boolean;
  data: NormalizedSong[];
}

const SongCard = ({ song, i, activeSong, isPlaying, data }: Props) => {
  const dispatch = useAppDispatch();
  const handlePlayPause = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(!isPlaying));
  };

  return (
    <div className="flex w-[250px] cursor-pointer flex-col rounded-lg bg-white/5 p-4 opacity-80 backdrop-blur-sm">
      <div className="group relative h-56 w-full">
        <div
          className={`absolute inset-0 items-center justify-center bg-black opacity-50 group-hover:flex ${activeSong?.id === song.id ? 'flex bg-black opacity-70' : 'hidden'}`}
        >
          <PlayPause
            song={song}
            activeSong={activeSong}
            isPlaying={isPlaying}
            handlePlay={handlePlayPause}
            handlePause={handlePlayPause}
          />
        </div>
        <img src={song.coverArt} alt={song.title} />
      </div>
      <div className="mt-4 flex flex-col">
        <p className="truncate text-lg font-semibold text-white">
          {song.detailRoute ? (
            <Link to={`${song.detailRoute}/${song.id}`}>{song.title}</Link>
          ) : (
            song.title
          )}
        </p>
        <p className="mt-1 truncate text-sm text-gray-300">
          <Link
            to={
              song.artistId
                ? `/artists/${song.artistId}`
                : `/search/${song.artist}`
            }
          >
            {song.artist}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
