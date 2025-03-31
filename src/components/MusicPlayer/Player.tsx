import { ReactEventHandler, useEffect, useRef } from 'react';
import { ShazamSongAttributes } from '../../types/apiTypes';

interface Props {
  activeSong?: ShazamSongAttributes;
  currentIndex?: number;
  isPlaying: boolean;
  volume: number;
  seekTime: number;
  onEnded?: ReactEventHandler<HTMLAudioElement>;
  onTimeUpdate?: ReactEventHandler<HTMLAudioElement>;
  onLoadedData?: ReactEventHandler<HTMLAudioElement>;
  repeat?: boolean;
}

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}: Props) => {
  const ref = useRef<HTMLAudioElement>(null);

  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  useEffect(() => {
    ref.current!.volume = volume;
  }, [volume]);
  // updates audio element only on seekTime change (and not on each rerender):
  useEffect(() => {
    ref.current!.currentTime = seekTime;
  }, [seekTime]);

  return (
    <audio
      src={activeSong?.streaming?.preview}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;
