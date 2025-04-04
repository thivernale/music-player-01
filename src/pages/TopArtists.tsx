import { ArtistCard, Error, Loader } from '../components';
import { useGetTrackSimilaritiesQuery } from '../redux/services/shazamApi';
import { ShazamSong } from '../types/shazamSongsListSimilarities';

const TopArtists = () => {
  const seedShazamSongId = '811314261';
  const { data, isFetching, error } =
    useGetTrackSimilaritiesQuery(seedShazamSongId);

  if (isFetching) {
    return <Loader title="Loading songs around you..." />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <h2 className="mt-4 mb-10 text-left text-3xl font-bold text-white">
        Top Artists
      </h2>

      <div className="flex flex-wrap justify-center gap-8 sm:justify-start">
        {data
          ?.reduce((songsUniquePerArtist, current) => {
            if (current.relationships.artists.data[0].id) {
              const artistId = current.relationships.artists.data[0].id;
              if (
                !songsUniquePerArtist.some(
                  (song) => song.relationships.artists.data[0].id === artistId,
                )
              ) {
                songsUniquePerArtist.push(current);
              }
            }
            return songsUniquePerArtist;
          }, [] as ShazamSong[])
          .map((song) => <ArtistCard key={song.id} song={song} />)}
      </div>
    </div>
  );
};

export default TopArtists;
