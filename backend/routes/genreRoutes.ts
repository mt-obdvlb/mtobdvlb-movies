import express from 'express';
import {
  createGenre,
  updateGenre,
  removeGenre,
  listGenres,
  readGenre
} from '../controllers/genreController.ts';

const router = express.Router()

import {authenticate, authorizeAdmin} from '../middlewares/authMiddleware.ts';

router.route('/').post(authenticate, authorizeAdmin, createGenre)
router.route('/:id').put(authenticate, authorizeAdmin, updateGenre)
router.route('/:id').delete(authenticate, authorizeAdmin, removeGenre )
router.route('/genres').get(listGenres)
router.route('/:id').get(readGenre)

export default router