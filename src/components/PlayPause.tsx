import { FaPause, FaPlay } from 'react-icons/fa';
import { NormalizedSong } from '../types/normalized';

interface PlayPauseProps {
  song?: NormalizedSong;
  handlePlay?: () => void;
  handlePause?: () => void;
  activeSong: NormalizedSong | undefined;
  isPlaying: boolean | undefined;
}

const PlayPause = ({
  song,
  handlePlay,
  handlePause,
  activeSong,
  isPlaying,
}: PlayPauseProps) =>
  isPlaying && activeSong?.id === song?.id ? (
    <FaPause size={35} className="text-gray-300" onClick={handlePause} />
  ) : (
    <FaPlay size={35} className="text-gray-300" onClick={handlePlay} />
  );

export default PlayPause;
