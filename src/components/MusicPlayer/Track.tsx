import { ShazamSongAttributes } from '../../types/shazamSongsListSimilarities';

interface Props {
  isPlaying?: boolean;
  isActive?: boolean;
  activeSong?: ShazamSongAttributes;
}

const Track = ({ isPlaying, isActive, activeSong }: Props) => (
  <div className="flex flex-1 items-center justify-start">
    <div
      className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} mr-4 hidden h-16 w-16 sm:block`}
    >
      <img
        src={activeSong?.images?.coverArt}
        alt="cover art"
        className="rounded-full"
      />
    </div>
    <div className="w-[50%]">
      <p className="truncate text-lg font-bold text-white">
        {activeSong?.title ? activeSong?.title : 'No active Song'}
      </p>
      <p className="truncate text-gray-300">
        {activeSong?.artist ? activeSong?.artist : 'No active Song'}
      </p>
    </div>
  </div>
);

export default Track;
