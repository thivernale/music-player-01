import { Error, Loader, SongCard } from '../components';
import { genres } from '../assets/constants';
import { useAppSelector } from '../redux/hooks';
import { useGetTrackSimilaritiesQuery } from '../redux/services/shazamApi';

const Discover = () => {
  const genreTitle = 'Pop';
  const seedShazamSongId = '811314261'; //1792077176
  const { data, isFetching, error } =
    useGetTrackSimilaritiesQuery(seedShazamSongId);
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);

  if (isFetching) return <Loader title={'Loading songs...'} />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="mt-4 mb-10 flex w-full flex-col items-center justify-between sm:flex-row">
        <h2 className="text-left text-3xl font-bold text-white">
          Discover {genreTitle}
        </h2>
        <select
          value={''}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            e;
          }}
          className="mt-5 rounded-lg bg-black p-3 text-sm text-gray-300 outline-none sm:mt-0"
        >
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap justify-center gap-8 sm:justify-start">
        {data?.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            i={i}
            data={data}
            activeSong={activeSong}
            isPlaying={isPlaying}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
