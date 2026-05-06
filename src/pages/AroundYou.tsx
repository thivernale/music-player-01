import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { Error, Loader, SongCard } from '../components';
import { NormalizedSong } from '../types/normalized';
import { getCountryCode } from '../utils/geo';

const AroundYou = () => {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);
  const normalizedSongs: NormalizedSong[] = []; //TODO: fetch by country and normalize with normalizeShazamSong

  useEffect(() => {
    getCountryCode()
      .then((countryCode) => setCountry(countryCode))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader title="Loading songs around you..." />;
  }

  if (!country) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <h2 className="mt-4 mb-10 text-left text-3xl font-bold text-white">
        Around You <span className="font-black">{country}</span>
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

export default AroundYou;
