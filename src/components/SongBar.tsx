import { Link } from 'react-router-dom';

import PlayPause from './PlayPause';
import { DatumType, ShazamSong } from '../types/shazamSongsListSimilarities';
import { ArtistSong, Type } from '../types/artistsTopSongs';

interface Props {
  song: ShazamSong | ArtistSong;
  artistId?: string;
  i: number;
  activeSong?: ShazamSong;
  isPlaying?: boolean;
  handlePlay?: (song: ShazamSong, i: number) => void;
  handlePause?: (song: ShazamSong, i: number) => void;
}

function isShazamSong(song: ShazamSong | ArtistSong): song is ShazamSong {
  return (song as ShazamSong).type === DatumType.ShazamSongs;
}

function isArtistSong(song: ShazamSong | ArtistSong): song is ArtistSong {
  return (song as ArtistSong).type === Type.Songs;
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

    {isArtistSong(song) && (
      <div className="flex flex-1 flex-row items-center justify-between">
        <img
          className="h-20 w-20 rounded-lg"
          src={song?.attributes?.artwork?.url
            .replace('{w}', '125')
            .replace('{h}', '125')}
          alt={song?.attributes.name}
        />
        <div className="mx-3 flex flex-1 flex-col justify-center">
          <p className="text-xl font-bold text-white">
            {song?.attributes?.name}
          </p>
          <p className="mt-1 text-base text-gray-300">
            {song?.attributes?.albumName}
          </p>
        </div>
      </div>
    )}

    {isShazamSong(song) && (
      <>
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
            <Link to={`/songs/${song.id}`}>
              <p className="text-xl font-bold text-white">
                {song?.attributes.title}
              </p>
            </Link>
            <p className="mt-1 text-base text-gray-300">
              <Link to={`/artists/${song?.relationships.artists.data[0].id}`}>
                {song?.attributes.artist}
              </Link>
            </p>
          </div>
        </div>
        <PlayPause
          isPlaying={isPlaying}
          activeSong={activeSong}
          song={song}
          handlePause={() => handlePause && handlePause(song, i)}
          handlePlay={() => handlePlay && handlePlay(song, i)}
        />
      </>
    )}
  </div>
);

export default SongBar;
