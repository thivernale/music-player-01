import { useParams } from 'react-router-dom';
import {
  useGetArtistDetailsQuery,
  useGetArtistTopSongsQuery,
} from '../redux/services/shazamApi';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { NormalizedSong } from '../types/normalized';
import { normalizeArtistTopSong } from '../utils/songAdapters';

const ArtistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const artistId = id as string;

  const dispatch = useAppDispatch();
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);

  const {
    data: artistData,
    isFetching,
    error,
  } = useGetArtistDetailsQuery(artistId);
  const {
    data: songData,
    isFetching: isFetchingSongs,
    error: errorSongs,
  } = useGetArtistTopSongsQuery(artistId);

  if (isFetching || isFetchingSongs)
    return <Loader title="Loading artist details..." />;
  if (error || errorSongs) return <Error />;

  const normalizedSongs: NormalizedSong[] =
    songData?.data.map((s) => normalizeArtistTopSong(s, artistId)) ?? [];

  const handlePlayPause = (song: NormalizedSong, i: number) => {
    dispatch(setActiveSong({ song, data: normalizedSongs, i }));
    dispatch(playPause(!isPlaying));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={artistId} artistData={artistData} />
      <RelatedSongs
        data={normalizedSongs}
        activeSong={activeSong}
        isPlaying={isPlaying}
        handlePlay={handlePlayPause}
        handlePause={handlePlayPause}
      />
    </div>
  );
};

export default ArtistDetails;
