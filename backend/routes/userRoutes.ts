import express from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.ts';

import {
  authenticate,
  authorizeAdmin
} from '../middlewares/authMiddleware.ts';


const router = express.Router();

router.route('/').post(createUser).get(
  authenticate,
  authorizeAdmin,
  getAllUsers
)
router.post('/auth', loginUser)
router.post('/logout', logoutUser )
router.route('/profile').get(
  authenticate,
  getUserProfile
).put(authenticate, updateUserProfile)

export default router;