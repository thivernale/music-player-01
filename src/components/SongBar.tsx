import { Link } from 'react-router-dom';

import PlayPause from './PlayPause';
import { ShazamSong } from '../types/shazamSongsListSimilarities';

interface Props {
  song: ShazamSong;
  artistId?: string;
  i: number;
  activeSong: ShazamSong;
  isPlaying: boolean;
  handlePlay: (song: ShazamSong, i: number) => void;
  handlePause: (song: ShazamSong, i: number) => void;
}

const SongBar = ({
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePause,
  handlePlay,
}: Props) => (
  <div
    className={`flex w-full flex-row items-center hover:bg-[#4c426e] ${activeSong?.id === song?.id ? 'bg-[#4c426e]' : 'bg-transparent'} mb-2 cursor-pointer rounded-lg p-4 py-2`}
  >
    <h3 className="mr-3 text-base font-bold text-white">{i + 1}.</h3>
    <div className="flex flex-1 flex-row items-center justify-between">
      <img
        className="h-20 w-20 rounded-lg"
        src={
          artistId
            ? song?.attributes?.artwork?.url
                .replace('{w}', '125')
                .replace('{h}', '125')
            : song?.attributes.images?.coverArt
        }
        alt={song?.attributes.title}
      />
      <div className="mx-3 flex flex-1 flex-col justify-center">
        {!artistId ? (
          <Link to={`/songs/${song.id}`}>
            <p className="text-xl font-bold text-white">
              {song?.attributes.title}
            </p>
          </Link>
        ) : (
          <p className="text-xl font-bold text-white">
            {song?.attributes?.name}
          </p>
        )}
        <p className="mt-1 text-base text-gray-300">
          {artistId ? song?.attributes?.albumName : song?.attributes.artist}
        </p>
      </div>
    </div>
    {!artistId ? (
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={() => handlePause(song, i)}
        handlePlay={() => handlePlay(song, i)}
      />
    ) : null}
  </div>
);

export default SongBar;
