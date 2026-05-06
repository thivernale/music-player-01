import { Link, useParams } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { useSearchQuery } from '../redux/services/shazamApi';
import { useAppSelector } from '../redux/hooks';
import { NormalizedSong } from '../types/normalized';
import {
  formatAppleArtworkUrl,
  normalizeAppleSong,
} from '../utils/songAdapters';

const Search = () => {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const { data, isFetching, error } = useSearchQuery(searchTerm as string);
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);

  if (isFetching) return <Loader title="Loading search results..." />;
  if (error) return <Error />;

  const normalizedSongs: NormalizedSong[] =
    data?.results?.songs?.data.map((item) => normalizeAppleSong(item)) ?? [];

  return (
    <div className="flex flex-col gap-1">
      <h2 className="mt-4 mb-10 text-left text-3xl font-bold text-white">
        Showing results for <span className="font-black">{searchTerm}</span>
      </h2>
      {data?.results?.artists && (
        <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
          {data.results.artists.data.map((item) => (
            <div key={item.id}>
              <img
                alt={item.attributes.name}
                title={item.attributes.name}
                src={formatAppleArtworkUrl(item.attributes.artwork.url)}
                className="h-56 w-full rounded-lg"
              />
              <Link to={`/artists/${item.id}`}>
                <p className="text-xl font-bold text-white">
                  {item.attributes.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
      {data?.results?.songs && (
        <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
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
      )}
    </div>
  );
};

export default Search;
