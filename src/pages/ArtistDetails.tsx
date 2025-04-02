import { useParams } from 'react-router-dom';
import {
  useGetArtistDetailsQuery,
  useGetArtistTopSongsQuery,
} from '../redux/services/shazamApi';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';

const ArtistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const artistId = id as string;

  const {
    data: artistData,
    isFetching,
    error,
  } = useGetArtistDetailsQuery(artistId);

  const {
    data,
    isFetching: isFetchingSongs,
    error: errorSongs,
  } = useGetArtistTopSongsQuery(artistId);

  if (isFetching || isFetchingSongs) {
    return <Loader title="Loading artist details..." />;
  }

  if (error || errorSongs) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={artistId} artistData={artistData} />

      <RelatedSongs artistId={artistId} data={data?.data} />
    </div>
  );
};

export default ArtistDetails;
