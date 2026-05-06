import { Link } from 'react-router-dom';
import { NormalizedSong } from '../../types/normalized';

interface Props {
  isPlaying?: boolean;
  isActive?: boolean;
  activeSong?: NormalizedSong;
}

const Track = ({ isPlaying, isActive, activeSong }: Props) => (
  <div className="flex flex-1 items-center justify-start">
    <div
      className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} mr-4 hidden h-16 w-16 sm:block`}
    >
      <img
        src={activeSong?.coverArt}
        alt="cover art"
        className="rounded-full"
      />
    </div>
    <div className="w-[50%]">
      <p className="truncate text-lg font-bold text-white">
        {activeSong?.title ? (
          activeSong.detailRoute ? (
            <Link to={`${activeSong.detailRoute}/${activeSong.id}`}>
              {activeSong.title}
            </Link>
          ) : (
            activeSong.title
          )
        ) : (
          'No active Song'
        )}
      </p>
      <p className="truncate text-gray-300">
        {activeSong?.artist ? (
          <Link
            to={
              activeSong.artistId
                ? `/artists/${activeSong.artistId}`
                : `/search/${activeSong.artist}`
            }
          >
            {activeSong.artist}
          </Link>
        ) : (
          'No active Song'
        )}
      </p>
    </div>
  </div>
);

export default Track;
