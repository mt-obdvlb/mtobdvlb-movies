import User from '../models/User.ts';
import type {IUser} from '../models/User.ts';
import bcrypt from 'bcryptjs'
import asyncHandler from '../middlewares/asyncHandler.ts';
import createToken from '../utils/createToken.ts';
import type {
  AuthRequest
} from '../middlewares/authMiddleware.ts';

const createUser = asyncHandler(async (req: AuthRequest, res) => {
  const {username, email, password} = req.body as IUser;
  if (!username || !email || !password) {
    throw new Error('请输入字段');
  }
  
  const userExists = await User.findOne({email});
  if (userExists) {
    return res.status(400).send('用户已存在')
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user: IUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    createToken(res, user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    throw new Error('创建用户失败')
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body as IUser;
  const existingUser = await User.findOne({email}) as IUser;
  if (!existingUser) {
    return res.status(400).json({message: '用户不存在'})
  }
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    return res.status(400).json({message: '密码错误'})
  }
  createToken(res, existingUser._id);
  return res.json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
})

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({message: '登出成功'})
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
})

const getUserProfile = asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('用户信息缺失');
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('用户不存在');
  }
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
})

const updateUserProfile = asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('用户信息缺失');
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('用户不存在');
  }
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }
  const updatedUser = await user.save();
  return res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
})

export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile
}