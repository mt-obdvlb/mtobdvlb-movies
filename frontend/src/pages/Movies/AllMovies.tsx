import {
  useGetAllMoviesQuery,
  useGetNewMoviesQuery,
  useGetRandomMoviesQuery,
  useGetTopMoviesQuery
} from '../../redux/api/movies';
import {useGetGenresQuery} from '../../redux/api/genre';
import MovieCard from './MovieCard';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import banner from '../../assets/banner.png';
import {
  setFilteredMovies,
  setMoviesFilter,
  setMovieYears,
  setUniqueYears,
} from '../../redux/features/movies/moviesSlice.ts';

const AllMovies = () => {
  const dispatch = useDispatch();
  const {data} = useGetAllMoviesQuery();
  const {data: genres} = useGetGenresQuery();
  const {data: newMovies} = useGetNewMoviesQuery();
  const {data: topMovies} = useGetTopMoviesQuery();
  const {data: randomMovies} = useGetRandomMoviesQuery();

  const {moviesFilter, filteredMovies} = useSelector((state) => state.movies);

  const movieYears = data?.map((movie) => movie.year);
  const uniqueYears = Array.from(new Set(movieYears));

  useEffect(() => {
    dispatch(setFilteredMovies(data || []));
    dispatch(setMovieYears(movieYears));
    dispatch(setUniqueYears(uniqueYears));
  }, [data, dispatch]);

  const applyFilters = () => {
    let result = data || [];

    // 如果是排序方式是 "new"、"top" 或 "random"，就换数据源
    switch (moviesFilter.selectedSort) {
      case 'new':
        result = newMovies || [];
        break;
      case 'top':
        result = topMovies || [];
        break;
      case 'random':
        result = randomMovies || [];
        break;
      default:
        result = data || [];
    }

    // 按搜索词过滤
    if (moviesFilter.searchTerm) {
      result = result.filter((movie) =>
        movie.name.toLowerCase().includes(moviesFilter.searchTerm.toLowerCase())
      );
    }

    // 按分类过滤
    if (moviesFilter.selectedGenre) {
      result = result.filter((movie) => movie.genre === moviesFilter.selectedGenre);
    }

    // 按年份过滤
    if (moviesFilter.selectedYear) {
      result = result.filter((movie) => movie.year === +moviesFilter.selectedYear);
    }

    dispatch(setFilteredMovies(result));
  };


  const handleSearchChange = (e) => {
    dispatch(setMoviesFilter({searchTerm: e.target.value}));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setMoviesFilter({selectedGenre: genreId}));
  };

  const handleYearChange = (year) => {
    dispatch(setMoviesFilter({selectedYear: year}));
  };

  const handleSortChange = (sortOption) => {
    dispatch(setMoviesFilter({selectedSort: sortOption}));
  };

  useEffect(() => {
    applyFilters();
  }, [moviesFilter, data, newMovies, topMovies, randomMovies]);


  return (
    <div
      className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 -translate-y-[5rem]'>
      <>
        <section>
          <div
            className='relative h-[50rem] w-screen mb-10 flex items-center justify-center bg-cover'
            style={{backgroundImage: `url(${banner})`}}
          >
            <div
              className='absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-60'></div>

            <div className='relative z-10 text-center text-white mt-[10rem]'>
              <h1 className='text-8xl font-bold mb-4'>电影中心</h1>
              <p className='text-2xl'>
                电影之旅：揭秘电影的魅力
              </p>
            </div>

            <section className='absolute -bottom-[5rem]'>
              <input
                type='text'
                className='w-[100%] h-[5rem] border px-10 outline-none rounded'
                placeholder='搜索电影'
                value={moviesFilter.searchTerm}
                onChange={handleSearchChange}
              />
              <section
                className='sorts-container mt-[2rem] ml-[10rem]  w-[30rem]'>
                <select
                  className='border p-2 rounded text-white'
                  value={moviesFilter.selectedGenre}
                  onChange={(e) => handleGenreClick(e.target.value)}
                >
                  <option value=''>分类</option>
                  {genres?.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>

                <select
                  className='border p-2 rounded ml-4 text-white'
                  value={moviesFilter.selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value=''>年份</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  className='border p-2 rounded ml-4 text-white'
                  value={moviesFilter.selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value=''>排序</option>
                  <option value='new'>最新电影</option>
                  <option value='top'>热门电影</option>
                  <option value='random'>可能适合你的</option>
                </select>
              </section>
            </section>
          </div>

          <section
            className='mt-[10rem] w-screen flex justify-center items-center flex-wrap'>
            {filteredMovies?.map((movie) => (
              <MovieCard key={movie._id} movie={movie}/>
            ))}
          </section>
        </section>
      </>
    </div>
  );
};

export default AllMovies;
