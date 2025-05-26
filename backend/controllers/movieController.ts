import asyncHandler from '../middlewares/asyncHandler.ts'
import Movie from '../models/Movie.ts'
import type { AuthRequest } from '../middlewares/authMiddleware.ts'

const createMovie = asyncHandler(async (req, res) => {
  try {
    const newMovie = new Movie(req.body)
    const savedMovie = await newMovie.save()
    res.json(savedMovie)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

const getAllMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find()
    res.json(movies)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

const getSpecificMovie = asyncHandler(async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({
        error: '没有该电影',
      })
    }
    res.json(movie)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

const updateMovie = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (!updatedMovie) {
      return res.status(404).json({
        error: '没有该电影',
      })
    }
    res.json(updatedMovie)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const movieReview = asyncHandler(async (req: AuthRequest, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).json({
        error: '没有该电影',
      })
    }
    const review = {
      name: req.user.username,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      user: req.user._id,
    }
    movie.reviews.push(review)
    movie.numReviews = movie.reviews.length
    movie.rating =
      movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
      movie.reviews.length
    await movie.save()
    res.json(movie)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    const deletedMovie = await Movie.findByIdAndDelete(id)
    if (!deletedMovie) {
      return res.status(404).json({
        error: '没有该电影',
      })
    }
    res.json(deletedMovie)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { movieId, reviewId } = req.body
    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({
        error: '没有该电影',
      })
    }
    const review = movie.reviews.find((r) => r._id.toString() === reviewId)
    if (!review) {
      return res.status(404).json({
        error: '没有该评论',
      })
    }
    movie.reviews = movie.reviews.filter((r) => r._id.toString() !== reviewId)
    movie.numReviews = movie.reviews.length
    movie.rating =
      movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
      movie.reviews.length
    await movie.save()
    res.json(movie)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const getNewMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(10)
    res.json(movies)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

const getTopMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find().sort({ numReviews: -1 }).limit(10)
    res.json(movies)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

const getRandomMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 10 } }])
    res.json(movies)
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})

export {
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
}
