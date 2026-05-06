import { ShazamSong } from '../types/shazamSongsListSimilarities';
import { NormalizedArtistDetails } from '../types/normalized';

export function getUniqueArtistDetails(
  data: ShazamSong[] | undefined,
): NormalizedArtistDetails[] {
  return (
    data?.reduce((acc: NormalizedArtistDetails[], current) => {
      const artistId = current.relationships?.artists?.data[0]?.id;
      if (artistId && !acc.some((s) => s.id === artistId)) {
        acc.push({
          id: artistId,
          name: current.attributes.artist,
          avatar: current.attributes.images?.artistAvatar,
        });
      }
      return acc;
    }, []) ?? []
  );
}
