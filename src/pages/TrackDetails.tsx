import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import {
  useGetTrackDetailsQuery,
  useGetTrackSimilaritiesQuery,
} from '../redux/services/shazamApi';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { NormalizedSong } from '../types/normalized';
import { normalizeShazamSong } from '../utils/songAdapters';
import { ShazamSong } from '../types/shazamSongsListSimilarities';

const TrackDetails = () => {
  const { songid } = useParams<{ songid: string }>();

  const dispatch = useAppDispatch();
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);
  const { data: songDetailsData, isFetching: isFetchingSongDetails } =
    useGetTrackDetailsQuery(songid as string);
  const {
    data: similarData,
    isFetching: isFetchingRelatedSongs,
    error,
  } = useGetTrackSimilaritiesQuery(songid as string);

  const mainSong = songDetailsData?.['shazam-songs']?.[songid as string];
  const allData: NormalizedSong[] = [
    ...(mainSong ? [normalizeShazamSong(mainSong as ShazamSong)] : []),
    ...(similarData?.map(normalizeShazamSong) ?? []),
  ];

  const handlePlayPause = (song: NormalizedSong, i: number) => {
    dispatch(setActiveSong({ song, data: allData, i }));
    dispatch(playPause(!isPlaying));
  };

  if (isFetchingRelatedSongs || isFetchingSongDetails) {
    return <Loader title="Loading track details..." />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <DetailsHeader songId={songid} songData={songDetailsData} />
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">Lyrics:</h2>
        <div className="mt-5 text-base text-gray-400">
          {songDetailsData?.lyrics ? (
            Object.values(songDetailsData.lyrics)
              .pop()
              ?.attributes.text.map((line, i) => (
                <p className="my-1" key={i}>
                  {line}
                </p>
              ))
          ) : (
            <p className="my-1">No lyrics found</p>
          )}
        </div>
      </div>

      <RelatedSongs
        activeSong={activeSong}
        isPlaying={isPlaying}
        data={allData}
        handlePlay={handlePlayPause}
        handlePause={handlePlayPause}
      />
    </div>
  );
};

export default TrackDetails;
