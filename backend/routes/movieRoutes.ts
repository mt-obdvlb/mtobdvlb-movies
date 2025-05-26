import express from 'express'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.ts'
import checkId from '../middlewares/checkId.ts'
import {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
} from '../controllers/movieController.ts'

const router = express.Router()

router.post('/create-movie', authenticate, authorizeAdmin, createMovie)
router.get('/all-movies', getAllMovies)
router.get('/specific-movie/:id', getSpecificMovie)
router.put('/update-movie/:id', authenticate, authorizeAdmin, updateMovie)
router.post('/reviews/:id', authenticate, checkId, movieReview)
router.delete('/delete-movie/:id', authenticate, authorizeAdmin, deleteMovie)
router.delete('/delete-comment', authenticate, authorizeAdmin, deleteComment)
router.get('/new-movies', getNewMovies)
router.get('/top-movies', getTopMovies)
router.get('/random-movies', getRandomMovies)

export default router
