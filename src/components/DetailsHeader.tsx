import { Resources } from '../types/shazamSongsGetDetails';
import { Link } from 'react-router-dom';

interface DetailsHeaderProps {
  artistId?: string;
  artistData?: null;
  songId?: string;
  songData?: Resources;
}

const DetailsHeader = ({
  artistId,
  artistData,
  songId,
  songData,
}: DetailsHeaderProps) => {
  const songAttributes =
    (songId && songData?.['shazam-songs'][songId]?.attributes) || undefined;

  return (
    <div className="relative flex w-full flex-col">
      <div className="h-28 w-full bg-gradient-to-l from-transparent to-black sm:h-48"></div>
      <div className="absolute inset-0 flex items-center">
        <img
          src={artistId ? 'TODO' : songAttributes?.images.coverArt}
          alt="art"
          className="h-28 w-28 rounded-full border-2 object-cover shadow-xl shadow-black sm:h-48 sm:w-48"
        />
        <div className="pl-5">
          <p className="text-xl font-bold text-white sm:text-3xl">
            {artistId ? 'TODO' : songAttributes?.title}
          </p>
          {songData?.artists && (
            <Link to={`/artists/${Object.keys(songData.artists).pop()}`}>
              <p className="mt-2 text-base text-gray-400">
                {songAttributes?.artist}
              </p>
            </Link>
          )}
          <p className="mt-2 text-base text-gray-400">
            {artistId ? 'TODO' : songAttributes?.genres.primary}
          </p>
        </div>
      </div>

      <div className="h-24 w-full sm:h-44" />
    </div>
  );
};

export default DetailsHeader;
