import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import Loader from '../../components/Loader.tsx';
import {
  setCredentials
} from '../../redux/features/auth/authSlice.ts';
import {useProfileMutation} from '../../redux/api/user.ts';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const {userInfo} = useSelector((state: any) => state.auth);
  
  const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()
  
  useEffect(() => {
    setUsername(userInfo.username)
    setEmail(userInfo.email)
    
  }, [userInfo.username, userInfo.email]);
  
  const dispatch = useDispatch();
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('密码不匹配');
      return;
    }
    
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      
      dispatch(setCredentials({...res}));
      toast.success('更新成功');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }
  
  return (
    <div className={'container mx-auto p-4 mt-[5rem]'}>
      <div
        className='flex justify-center align-center md:flex md:space-x-4'>
        <div className={'md:w-1/3'}>
          <h2 className={'text-2xl font-semibold mb-4'}>
            更新个人资料
          </h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-white mb-2">用户名</label>
              <input
                type="text"
                placeholder="请输入用户名"
                className="form-input p-4 rounded-sm w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">邮箱</label>
              <input
                type="email"
                placeholder="请输入邮箱"
                className="form-input p-4 rounded-sm w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">密码</label>
              <input
                type="password"
                placeholder="请输入密码"
                className="form-input p-4 rounded-sm w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">
                确认密码
              </label>
              <input
                type="password"
                placeholder="请再次输入密码"
                className="form-input p-4 rounded-sm w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-teal-500 w-screen mt-[2rem] font-bold text-white py-2 px-4 rounded hover:bg-teal-600"
              >
                更新
              </button>
              
              {loadingUpdateProfile && <Loader />}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
