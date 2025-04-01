import { ShazamSong } from '../types/shazamSongsListSimilarities';
import PlayPause from './PlayPause';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

interface Props {
  song: ShazamSong;
  i: number;
  activeSong?: ShazamSong;
  isPlaying?: boolean;
  data: ShazamSong[];
}

const SongCard = ({ song, i, activeSong, isPlaying, data }: Props) => {
  const dispatch = useAppDispatch();
  const handlePlayPause = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(!isPlaying));
  };

  return (
    <div className="/*animate-pulse*/ flex w-[250px] cursor-pointer flex-col rounded-lg bg-white/5 p-4 opacity-80 backdrop-blur-sm">
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
        <img
          src={song.attributes.images?.coverArt}
          alt={song.attributes.title}
        />
      </div>
      <div className="mt-4 flex flex-col">
        <p className="truncate text-lg font-semibold text-white">
          <Link to={`/songs/${song?.id}`}>{song.attributes.title}</Link>
        </p>
        <p className="mt-1 truncate text-sm text-gray-300">
          <Link to={`/artists/${song?.relationships.artists.data[0].id}`}>
            {song.attributes.artist}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
