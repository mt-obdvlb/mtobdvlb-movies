import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import MovieCard from '../pages/Movies/MovieCard.tsx';

const SliderUtil = ({data}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(data?.length, 4),
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2000,
    arrow: true
  }
  return (
    <Slider  {...settings}>
      {data?.map((movie) => (
        <MovieCard movie={movie} key={movie._id}/>
      ))}
    </Slider>
  );
};

export default SliderUtil;
