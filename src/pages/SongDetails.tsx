import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import {
  useGetTrackDetailsQuery,
  useGetTrackSimilaritiesQuery,
} from '../redux/services/shazamApi';
import { ShazamSong } from '../types/shazamSongsListSimilarities';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongDetails = () => {
  const { songid } = useParams<{ songid: string }>();

  const dispatch = useAppDispatch();
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);
  const { data: songDetailsData, isFetching: isFetchingSongDetails } =
    useGetTrackDetailsQuery(songid as string);
  const {
    data,
    isFetching: isFetchingRelatedSongs,
    error,
  } = useGetTrackSimilaritiesQuery(songid as string);

  const allData = [
    songDetailsData?.['shazam-songs']?.[songid as string] as ShazamSong,
    ...(data || []),
  ];

  const handlePlayPause = (song: ShazamSong, i: number) => {
    dispatch(setActiveSong({ song, data: allData || [], i }));
    dispatch(playPause(!isPlaying));
  };

  if (isFetchingRelatedSongs || isFetchingSongDetails) {
    return <Loader title="Loading song details..." />;
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

export default SongDetails;
