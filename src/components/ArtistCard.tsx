import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
  name: string;
  avatar?: string;
}

const ArtistCard = ({ id, name, avatar }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="animate-slideup flex w-[250px] cursor-pointer flex-col rounded-lg bg-white/5 p-4 opacity-80 backdrop-blur-sm"
      onClick={() => navigate(`/artists/${id}`)}
    >
      <img
        alt={name}
        title={name}
        src={avatar}
        className="h-56 w-full rounded-lg"
      />
      <p className="mt-4 truncate text-lg font-semibold text-white">{name}</p>
    </div>
  );
};

export default ArtistCard;
