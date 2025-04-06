import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  }

  return (
    <form
      autoComplete="off"
      className="p-2 text-gray-400 focus-within:text-gray-600"
      onSubmit={handleSubmit}
    >
      <label htmlFor="search-field" className="sr-only">
        Search all songs
      </label>
      <div className="flex flex-row items-center justify-start">
        <FiSearch className="ml-4 h-5 w-5" />
        <input
          type="search"
          name="search-field"
          autoComplete="off"
          id="search-field"
          placeholder="Search all songs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bo-none flex-1 bg-transparent p-4 text-base text-white placeholder-gray-500 outline-none"
        />
      </div>
    </form>
  );
};

export default Searchbar;
