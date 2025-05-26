import Header from './Movies/Header.tsx';
import MoviesContainerPage from './Movies/MoviesContainerPage.tsx';

const Home = () => {
  return (
    <>
      <Header/>
      <section className='mt-[10rem]'>
        <MoviesContainerPage/>
      </section>
    </>
  );
};

export default Home;
