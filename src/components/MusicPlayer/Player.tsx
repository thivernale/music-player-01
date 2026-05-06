import { ReactEventHandler, useEffect, useRef } from 'react';
import { NormalizedSong } from '../../types/normalized';

interface Props {
  activeSong?: NormalizedSong;
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
    if (isPlaying) ref.current.play();
    else ref.current.pause();
  }

  useEffect(() => {
    ref.current!.volume = volume;
  }, [volume]);
  useEffect(() => {
    ref.current!.currentTime = seekTime;
  }, [seekTime]);

  return (
    <audio
      src={activeSong?.previewUrl}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;
