import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import {
  BsArrowRepeat,
  BsFillPauseFill,
  BsFillPlayFill,
  BsShuffle,
} from 'react-icons/bs';
import * as React from 'react';
import { ShazamSong } from '../../types/shazamSongsListSimilarities';

interface Props {
  isPlaying?: boolean;
  isActive?: boolean;
  repeat?: boolean;
  shuffle?: boolean;
  currentSongs: ShazamSong[];
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  setShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  handlePlayPause: () => void;
  handlePrevSong: () => void;
  handleNextSong: () => void;
}

const Controls = ({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  currentSongs,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
}: Props) => (
  <div className="flex items-center justify-around md:w-36 lg:w-52 2xl:w-80">
    <BsArrowRepeat
      size={20}
      color={repeat ? 'red' : 'white'}
      onClick={() => setRepeat((prev) => !prev)}
      className="hidden cursor-pointer sm:block"
    />
    {currentSongs?.length && (
      <MdSkipPrevious
        size={30}
        color="#FFF"
        className="cursor-pointer"
        onClick={handlePrevSong}
      />
    )}
    {isPlaying ? (
      <BsFillPauseFill
        size={45}
        color="#FFF"
        onClick={handlePlayPause}
        className="cursor-pointer"
      />
    ) : (
      <BsFillPlayFill
        size={45}
        color="#FFF"
        onClick={handlePlayPause}
        className="cursor-pointer"
      />
    )}
    {currentSongs?.length && (
      <MdSkipNext
        size={30}
        color="#FFF"
        className="cursor-pointer"
        onClick={handleNextSong}
      />
    )}
    <BsShuffle
      size={20}
      color={shuffle ? 'red' : 'white'}
      onClick={() => setShuffle((prev: boolean) => !prev)}
      className="hidden cursor-pointer sm:block"
    />
  </div>
);

export default Controls;
