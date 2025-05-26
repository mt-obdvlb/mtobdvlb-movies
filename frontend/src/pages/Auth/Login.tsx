import {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../components/Loader.tsx';
import {
  setCredentials
} from '../../redux/features/auth/authSlice.ts';
import {toast} from 'react-toastify';
import {useLoginMutation} from '../../redux/api/user.ts';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [login, {isLoading}] = useLoginMutation();
  const {userInfo} = useSelector(state => state.auth);
  
  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);
  
  const submitHandler = async (e) => {
    e.preventDefault()
    
    try {
      const res = await login({email, password}).unwrap()
      dispatch(setCredentials({...res}))
      navigate(redirect)
      
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
    
  }
  
  return (
    <div>
      <section className={'pl-[10rem] flex flex-wrap'}>
        <div className={'mr-[4rem] mt-5[rem]'}>
          <h1
            className={'text-2xl font-semibold mb-4'}>登录</h1>
          <form onSubmit={submitHandler}
                className={'container w-[40rem]'}>
            <div className={'my-[2rem]'}>
              <label htmlFor={'email'} className={
                'block text-sm font-medium text-white'
              }
              >邮箱
              </label>
              <input type={'email'} id={'email'}
                     className={
                       'mt-1 p-2 border rounded w-full'
                     }
                     placeholder={'请输入邮箱'}
                     value={email}
                     onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className={'my-[2rem]'}>
              <label htmlFor={'password'} className={
                'block text-sm font-medium text-white'
              }
              >密码
              </label>
              <input type={'password'} id={'password'}
                     className={
                       'mt-1 p-2 border rounded w-full'
                     }
                     placeholder={'请输入密码'}
                     value={password}
                     onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button disabled={isLoading} type={'submit'}
                    className={'bg-teal-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]'}
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
            {isLoading && <Loader/>}
          </form>
          
          <div className={'mt-4'}>
            <p className={'text-white'}>
              新用户？ {' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                className={'text-teal-500' +
                  ' hover:underline'}>
                去注册
              </Link>
            </p>
          </div>
        
        </div>
        <img
          src='https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt=''
          className='h-[65rem] w-[45%] xl:block md:hidden sm:hidden rounded-lg'
        />
      </section>
    </div>
  );
};

export default Login;
