import { useState } from 'react'
import {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useGetGenresQuery,
  useUpdateGenreMutation,
} from '../../redux/api/genre.ts'
import { toast } from 'react-toastify'
import GenreForm from '../../components/GenreForm.tsx'
import Modal from '../../components/Modal.tsx'

const GenreList = () => {
  const { data: genres, refetch } = useGetGenresQuery()
  const [name, setName] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [updatingName, setUpdatingName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [createGenre] = useCreateGenreMutation()
  const [updateGenre] = useUpdateGenreMutation()
  const [deleteGenre] = useDeleteGenreMutation()

  const handlerCreateGenre = async (e) => {
    e.preventDefault()
    if (!name) {
      toast.error('请输入分类名称')
      return
    }
    try {
      const res = await createGenre({ name }).unwrap()
      if (res.error) {
        toast.error(res.error)
      } else {
        setName('')
        toast.success(res.name + '创建成功')
        refetch()
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleUpdateGenre = async (e) => {
    e.preventDefault()
    if (!updateGenre) {
      toast.error('请选择要更新的分类')
      return
    }
    try {
      const res = await updateGenre({
        id: selectedGenre._id,
        updateGenre: {
          name: updatingName,
        },
      }).unwrap()
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.name + '更新成功')
        refetch()
        setSelectedGenre(null)
        setUpdatingName('')
        setModalVisible(false)
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleDeleteGenre = async (e) => {
    e.preventDefault()
    try {
      const res = await deleteGenre(selectedGenre._id).unwrap()
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.name + '删除成功')
        setSelectedGenre(null)
        setUpdatingName('')
        setModalVisible(false)
        refetch()
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <div className="md:w-3/4 p-3">
        <h1 className="h-12">管理分类</h1>
        <GenreForm
          value={name}
          setValue={setName}
          handleSubmit={handlerCreateGenre}
        />
        <br />
        <div className="flex flex-wrap">
          {genres?.map((genre) => (
            <div key={genre._id}>
              <button
                className="cursor-pointer bg-white border border-teal-500 text-teal-500 py-2 px-4 rounded-lg m-3 hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                onClick={() => {
                  {
                    setModalVisible(true)
                    setSelectedGenre(genre)
                    setUpdatingName(genre.name)
                  }
                }}>
                {genre.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <GenreForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateGenre}
            buttonText={'更新'}
            handleDelete={handleDeleteGenre}
          />
        </Modal>
      </div>
    </div>
  )
}

export default GenreList
