import { useAppSelector } from '../redux/hooks';
import { Error, Loader, SongCard } from '../components';
import { useGetTrackSimilaritiesQuery } from '../redux/services/shazamApi';
import { NormalizedSong } from '../types/normalized';
import { normalizeShazamSong } from '../utils/songAdapters';

const TopCharts = () => {
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);

  const seedShazamSongId = '811314261';
  const { data, isFetching, error } =
    useGetTrackSimilaritiesQuery(seedShazamSongId);

  if (isFetching) {
    return <Loader title="Loading songs around you..." />;
  }

  if (error) {
    return <Error />;
  }

  const normalizedSongs: NormalizedSong[] =
    data?.map(normalizeShazamSong) ?? [];

  return (
    <div className="flex flex-col">
      <h2 className="mt-4 mb-10 text-left text-3xl font-bold text-white">
        Top Charts
      </h2>

      <div className="flex flex-wrap justify-center gap-8 sm:justify-start">
        {normalizedSongs.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            i={i}
            data={normalizedSongs}
            activeSong={activeSong}
            isPlaying={isPlaying}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCharts;
