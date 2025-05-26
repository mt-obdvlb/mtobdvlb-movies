import {useNavigate} from 'react-router'
import {useEffect, useState} from 'react'
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from '../../redux/api/movies.ts'
import {useGetGenresQuery} from '../../redux/api/genre.ts'
import {toast} from 'react-toastify';

export interface movieProps {
  name: string
  year: number | ''
  cast: string[]
  rating: number
  image: File | null
  genre: string
  detail: string

}

const CreateMovie = () => {
  const navigate = useNavigate()
  const [movieData, setMovieData] = useState<movieProps>({
    name: '',
    year: '',
    cast: [],
    rating: 0,
    image: null,
    genre: '',
    detail: '',
  })
  const [selectedImage, setSelectedImage] = useState()
  const [
    CreateMovie,
    {
      isLoading: isCreatingMovie,
      error: createMovieErrorDetail
    },
  ] = useCreateMovieMutation()
  const [
    uploadImage,
    {
      isLoading: isUploadingImage,
      error: uploadImageErrorDetails
    },
  ] = useUploadImageMutation()
  const {
    data: genres,
    isLoading: isLoadingGenres
  } = useGetGenresQuery()
  useEffect(() => {
    if (genres) {
      setMovieData((prev) => ({
        ...prev,
        genre: genres[0]?._id || '',
      }))
    }
  }, [genres])

  const handleChange = (e) => {
    const {name, value} = e.target
    if (name === 'genre') {
      console.log(name, value)
      const selectedGenre = genres.find(
        (genre) => genre._id === value
      )
      setMovieData((prevData) => ({
        ...prevData,
        genre: selectedGenre ? selectedGenre._id : '',
      }))
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const handleCreateMovie = async (e) => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        !movieData.cast ||
        !selectedImage
      ) {
        toast.error('请输入字段')
        return
      }
      let uploadedImagePath = ''
      if (selectedImage) {
        const formData = new FormData()
        formData.append('image', selectedImage)
        const uploadImageResponse = await uploadImage(formData)
        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image
        } else {
          toast.error('上传图片失败')
          return
        }
        await CreateMovie({
          ...movieData,
          image: uploadedImagePath,
        })
        navigate('/admin/movies-list')
        setMovieData({
          name: '',
          year: 0,
          detail: '',
          cast: [],
          rating: 0,
          image: null,
          genre: '',
        })
        toast.success('创建成功')
      }
    } catch (error) {
      toast.error(error.error || error.message)
    }
  }

  return (
    <div
      className='container mt-4 flex items-center justify-center'>
      <form>
        <p
          className='mb-4 w-[50rem] text-2xl text-green-200'>新增电影</p>
        <div className='mb-4'>
          <label className='block'>
            名字:
            <input type='text' name='name'
                   value={movieData.name}
                   onChange={handleChange}
                   className='border px-2 py-1 w-full rounded'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            年份:
            <input type='number' name='year'
                   value={movieData.year}
                   onChange={handleChange}
                   className='border px-2 py-1 w-full rounded'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            详情:
            <textarea name='detail'
                      value={movieData.detail}
                      onChange={handleChange}
                      className='border px-2 py-1 w-full rounded'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            演员:
            <input type='text' name='cast'
                   value={movieData.cast.join(', ')}
                   onChange={(e) => setMovieData(movieData => ({
                     ...movieData,
                     cast: e.target.value.split(', ')
                   }))}
                   className='border px-2 py-1 w-full rounded'
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className='block'>
            分类:
            <select name='genre' value={movieData.genre}
                    onChange={handleChange}
                    className='border px-2 py-1 w-full rounded'
            >
              {isLoadingGenres ? (
                <option>加载分类中...</option>) : (
                genres.map(genre => (
                  <option key={genre._id}
                          value={genre._id}>
                    {genre.name}
                  </option>
                ))
              )}
            </select>

          </label>
        </div>
        <div className='mb-4'>
          <label style={!selectedImage ? {
            border: '1px solid #888',
            borderRadius: '5px',
            padding: '8px'
          } : {
            border: '0',
            borderRadius: '0',
            padding: '0'
          }}>
            {!selectedImage && '上传图片'}
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              style={{display: !selectedImage ? 'none' : 'block'}}

            />
          </label>
        </div>
        <button
          type='button'
          onClick={handleCreateMovie}
          className='bg-teal-500 text-white px-4 py-2 rounded'
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? '创建中...' : '创建电影'}
        </button>
      </form>
    </div>
  )
}

export default CreateMovie
