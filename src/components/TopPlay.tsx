import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'swiper/css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'swiper/css/free-mode';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTrackSimilaritiesQuery } from '../redux/services/shazamApi';
import { ShazamSong } from '../types/shazamSongsListSimilarities';
import PlayPause from './PlayPause';

interface TopChartCardProps {
  song: ShazamSong;
  i: number;
  activeSong: ShazamSong;
  isPlaying: boolean;
  handlePlay: (song: ShazamSong, i: number) => void;
  handlePause: (song: ShazamSong, i: number) => void;
}

function TopChartCard({
  song,
  i,
  activeSong,
  isPlaying,
  handlePlay,
  handlePause,
}: TopChartCardProps) {
  return (
    <div className="mb-2 flex w-full cursor-pointer flex-row items-center rounded-lg p-4 py-2 hover:bg-[#4c426e]">
      <h3 className="mr-3 text-base font-bold text-white">{i + 1}.</h3>
      <div className="flex flex-1 flex-row items-center justify-between">
        <img
          src={song.attributes.images?.coverArt}
          alt={song.attributes.title}
          className="h-20 w-20 rounded-lg"
        />
        <div className="mx-3 flex flex-1 flex-col justify-center">
          <p className="truncate text-xl font-bold text-white">
            <Link to={`/songs/${song?.id}`}>{song.attributes.title}</Link>
          </p>
          <p className="mt-1 truncate text-base text-gray-300">
            <Link to={`/artists/${song?.relationships.artists.data[0].id}`}>
              {song.attributes.artist}
            </Link>
          </p>
        </div>
      </div>
      <PlayPause
        song={song}
        activeSong={activeSong}
        isPlaying={isPlaying}
        handlePlay={() => handlePlay(song, i)}
        handlePause={() => handlePause(song, i)}
      />
    </div>
  );
}

const TopPlay = () => {
  const seedSongId = '811314261';
  const { data } = useGetTrackSimilaritiesQuery(seedSongId);

  const dispatch = useAppDispatch();
  const { activeSong, isPlaying } = useAppSelector(({ player }) => player);
  const handlePlayPause = (song: ShazamSong, i: number) => {
    dispatch(setActiveSong({ song, data: data || [], i }));
    dispatch(playPause(!isPlaying));
  };
  const divRef = useRef<HTMLDivElement>(null);

  const topPlays = data?.slice(0, 5);

  useEffect(() => {
    if (!divRef.current) return;
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <div
      ref={divRef}
      className="mb-6 ml-0 flex max-w-full flex-1 flex-col xl:mb-0 xl:ml-6 xl:max-w-[500px]"
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Top Charts</h2>
          <Link to={'/top-charts'}>
            <p className="cursor-pointer text-base text-gray-300">See more</p>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {topPlays?.map((song, i) => (
            <TopChartCard
              key={song.id}
              song={song}
              i={i}
              activeSong={activeSong}
              isPlaying={isPlaying}
              handlePlay={handlePlayPause}
              handlePause={handlePlayPause}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Top Artists</h2>
          <Link to={'/top-artists'}>
            <p className="cursor-pointer text-base text-gray-300">See more</p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4"
        >
          {data
            ?.reduce((songsUniquePerArtist, current) => {
              if (current.relationships.artists.data[0].id) {
                const artistId = current.relationships.artists.data[0].id;
                if (
                  !songsUniquePerArtist.some(
                    (song) =>
                      song.relationships.artists.data[0].id === artistId,
                  )
                ) {
                  songsUniquePerArtist.push(current);
                }
              }
              return songsUniquePerArtist;
            }, [] as ShazamSong[])
            .map((song) => (
              <SwiperSlide
                key={song.id}
                style={{ width: '25%', height: 'auto' }}
                className="animate-slideright rounded-full shadow-lg"
              >
                <Link to={`/artists/${song.relationships.artists.data[0].id}`}>
                  <img
                    alt={song.attributes.artist}
                    title={song.attributes.artist}
                    src={song.attributes.images?.artistAvatar}
                    className="w-full rounded-full object-cover"
                  />
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;
