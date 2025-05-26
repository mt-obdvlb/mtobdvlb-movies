import {Link} from 'react-router-dom';

const MovieTabs = ({userInfo, submitHandler, comment, setComment, movie}) => {
  return (
    <div>
      <section>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            <div className='my-2'>
              <label htmlFor='comment' className='block text-xl mb-2'>
                请写感想
              </label>

              <textarea
                id='comment'
                rows='3'
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='p-2 border rounded-lg xl:w-[40rem] text-black'
              ></textarea>
            </div>

            <button
              type='submit'
              className='bg-teal-600 text-white py-2 px-4 rounded-lg'
            >
              提交
            </button>
          </form>
        ) : (
          <p>
            请 <Link to='/login'>登录</Link> 来写感想
          </p>
        )}
      </section>

      <section className='mt-[3rem]'>
        <div>{movie?.reviews.length === 0 && <p>没有评论</p>}</div>

        <div>
          {movie?.reviews.map((review) => (
            <div
              key={review._id}
              className='bg-[#1A1A1A] p-4 rounded-lg w-[50%] mt-[2rem]'
            >
              <div className='flex justify-between'>
                <strong className='text-[#B0B0B0]'>{review.name}</strong>
                <p className='text-[#B0B0B0]'>
                  {review.createdAt.substring(0, 10)}
                </p>
              </div>

              <p className='my-4'>{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieTabs;
