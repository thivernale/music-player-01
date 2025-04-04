import { useNavigate } from 'react-router-dom';
import { ShazamSong } from '../types/shazamSongsListSimilarities';

interface Props {
  song: ShazamSong;
}

const ArtistCard = ({ song }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="animate-slideup flex w-[250px] cursor-pointer flex-col rounded-lg bg-white/5 p-4 opacity-80 backdrop-blur-sm"
      onClick={() =>
        navigate(`/artists/${song.relationships.artists.data[0].id}`)
      }
    >
      <img
        alt={song.attributes.artist}
        title={song.attributes.artist}
        src={song.attributes.images?.artistAvatar}
        className="h-56 w-full rounded-lg"
      />
      <p className="mt-4 truncate text-lg font-semibold text-white">
        {song.attributes.artist}
      </p>
    </div>
  );
};

export default ArtistCard;
