export interface GenreFormProps {
  value: string
  setValue: (value: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  buttonText?: string
  handleDelete?: () => void
}

const GenreForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = '提交',
  handleDelete,
}: GenreFormProps) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-[60rem]"
          placeholder="请输入分类名"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 cursor-pointer">
            {buttonText}
          </button>
          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
              删除
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default GenreForm
