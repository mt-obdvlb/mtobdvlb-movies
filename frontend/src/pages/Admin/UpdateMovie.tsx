import {useNavigate, useParams} from 'react-router';
import {useEffect, useState} from 'react';
import type {movieProps} from './CreateMovie.tsx';
import {
  useDeleteMovieMutation,
  useGetSpecificMovieQuery,
  useUpdateMovieMutation, useUploadImageMutation
} from '../../redux/api/movies.ts';
import {toast} from 'react-toastify';

const UpdateMovie = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState<movieProps>({
    name: '',
    year: 0,
    detail: '',
    cast: [],
    ratings: 0,
    image: null,
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const {data: initialMovieData} = useGetSpecificMovieQuery(id);
  useEffect(() => {
    if (initialMovieData) {
      setMovieData(initialMovieData)
    }
  }, [initialMovieData]);
  const [updateMovie, {isLoading: isUpdatingMovie}] = useUpdateMovieMutation();
  const [uploadImage, {
    isLoading: isUploadingImage,
    error: uploadImageErrorDetails
  }] = useUploadImageMutation();
  const [deleteMovie] = useDeleteMovieMutation();
  const handleChange = (e) => {

    const {name, value} = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpdateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        !movieData.cast
      ) {
        toast.error('请输入字段')
        console.log('请输入字段')
        return
      }
      let uploadedImagePath = movieData.image;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const uploadImageResponse = await uploadImage(formData);
        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image
        } else {
          toast.error('上传图片失败')
          return
        }
        await updateMovie({
          id: id,
          updatedMovie: {
            ...movieData,
            image: uploadedImagePath,
          },
        });
        toast.success('修改成功')
        navigate('/admin/movies-list');
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleDeleteMovie = async () => {
    try {
      await deleteMovie(id);
      toast.success('删除成功')
      navigate('/admin/movies-list');
    } catch (error) {
      toast.error('删除失败')
    }
  };

  return (
    <div className='container flex justify-center items-center mt-4'>
      <form>
        <p className='text-green-200 w-[50rem] text-2xl mb-4'>修改电影</p>
        <div className='mb-4'>
          <label className='block'>
            名字:
            <input
              type='text'
              name='name'
              value={movieData.name}
              onChange={handleChange}
              className='border px-2 py-1 w-full'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            年份:
            <input
              type='number'
              name='year'
              value={movieData.year}
              onChange={handleChange}
              className='border px-2 py-1 w-full'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            详情:
            <textarea
              name='detail'
              value={movieData.detail}
              onChange={handleChange}
              className='border px-2 py-1 w-full'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            演员:
            <input
              type='text'
              name='cast'
              value={movieData.cast.join(', ')}
              onChange={(e) =>
                setMovieData({...movieData, cast: e.target.value.split(', ')})
              }
              className='border px-2 py-1 w-full'
            />
          </label>
        </div>

        <div className='mb-4'>
          <label
            className='cursor-pointer'
            style={
              !selectedImage
                ? {
                  border: '1px solid #888',
                  borderRadius: '5px',
                  padding: '8px',
                }
                : {
                  border: '0',
                  borderRadius: '0',
                  padding: '0',
                }
            }
          >
            {!selectedImage && '上传图片'}
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='cursor-pointer'
              style={{display: !selectedImage ? 'none' : 'block'}}
            />
          </label>
        </div>
        <button
          type='button'
          onClick={handleUpdateMovie}
          className='bg-teal-500 text-white px-4 py-2 rounded cursor-pointer'
          disabled={isUpdatingMovie || isUploadingImage}
        >
          {isUpdatingMovie || isUploadingImage ? '修改中...' : '修改电影'}
        </button>

        <button
          type='button'
          onClick={handleDeleteMovie}
          className='bg-red-500 text-white px-4 py-2 rounded ml-2 cursor-pointer'
          disabled={isUpdatingMovie || isUploadingImage}
        >
          {isUpdatingMovie || isUploadingImage ? '删除中...' : '删除电影'}
        </button>
      </form>
    </div>
  );
};

export default UpdateMovie;
