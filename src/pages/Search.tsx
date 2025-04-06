import { Link, useParams } from 'react-router-dom';
import { Error, Loader } from '../components';
import { useSearchQuery } from '../redux/services/shazamApi';

const Search = () => {
  const { searchTerm } = useParams<{ searchTerm: string }>();

  const { data, isFetching, error } = useSearchQuery(searchTerm as string);

  if (isFetching) {
    return <Loader title="Loading search results..." />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col gap-1">
      <h2 className="mt-4 mb-10 text-left text-3xl font-bold text-white">
        Showing results for <span className="font-black">{searchTerm}</span>
      </h2>
      <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
        {data?.artists.hits.map((item) => (
          <div className="" key={item.artist.adamid}>
            <img
              alt={item.artist.name}
              title={item.artist.name}
              src={item.artist.avatar}
              className="h-56 w-full rounded-lg"
            />
            <Link to={`/artists/${item.artist.adamid}`}>
              <p className="text-xl font-bold text-white">{item.artist.name}</p>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1 sm:justify-start">
        {data?.tracks.hits.map((item) => (
          <div
            className="mb-2 flex w-full cursor-pointer flex-row items-center rounded-lg p-4 py-2 hover:bg-[#4c426e]"
            key={item.track.key}
          >
            <img
              className="h-20 w-20 rounded-lg"
              src={item.track.images?.coverart}
              alt={item.track.title}
            />
            <div className="mx-3 flex flex-1 flex-col justify-center">
              <Link to={`/songs/${item.track.key}`}>
                <p className="text-xl font-bold text-white">
                  {item.track.title}
                </p>
              </Link>
              <p className="mt-1 text-base text-gray-300">
                <Link to={`/artists/${item.track.artists[0].adamid}`}>
                  {item.track.subtitle}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
