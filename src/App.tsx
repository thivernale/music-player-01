import { Route, Routes } from 'react-router-dom';

import { MusicPlayer, Searchbar, Sidebar, TopPlay } from './components';
import {
  AroundYou,
  ArtistDetails,
  Discover,
  Search,
  SongDetails,
  TopArtists,
  TopCharts,
} from './pages';
import { useAppSelector } from './redux/hooks';

const App = () => {
  const { activeSong } = useAppSelector((state) => state.player);

  return (
    <div className="relative flex">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-gradient-to-br from-black to-[#121286]">
        <Searchbar />

        <div className="hide-scrollbar flex h-[calc(100vh-72px)] flex-col-reverse overflow-y-scroll px-6 xl:flex-row">
          <div className="h-fit flex-1 pb-40">
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/top-charts" element={<TopCharts />} />
              <Route path="/around-you" element={<AroundYou />} />
              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
            </Routes>
          </div>
          <div className="relative top-0 h-fit xl:sticky">
            <TopPlay />
          </div>
        </div>
      </div>

      {activeSong?.id && (
        <div className="animate-slideup absolute right-0 bottom-0 left-0 z-10 flex h-28 rounded-t-3xl bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
