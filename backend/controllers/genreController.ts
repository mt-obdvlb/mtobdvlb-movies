import Genre from '../models/Genre.ts';
import asyncHandler from '../middlewares/asyncHandler.ts';

const createGenre = asyncHandler(async (req, res) => {
  const {name} = req.body;
  if (!name) {
    return res.status(400).send('请输入字段');
  }
  const existingGenre = await Genre.findOne({name});
  if (existingGenre) {
    return res.status(400).send('该分类已存在');
  }
  
  const genre = await new Genre({name}).save()
  
  res.status(201).json(genre);
});

const updateGenre = asyncHandler(async (req, res) => {
  const {name} = req.body;
  const {id} = req.params
  
  const genre = await Genre.findById(id)
  if (!genre) {
    return res.status(404).send('该分类不存在')
  }
  genre.name = name || genre.name;
  
  const updatedGenre = await genre.save();
  res.json(updatedGenre);
  
})

const removeGenre = asyncHandler(async (req, res) => {
  const {id} = req.params
  
  const removed = await Genre.findByIdAndDelete(id)
  if (!removed) {
    return res.status(404).send('该分类不存在')
  }
  res.json(removed)
})

const listGenres = asyncHandler(async (req, res) => {
  const genres = await Genre.find({});
  res.json(genres);
});

const readGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404);
    throw new Error('分类不存在');
  }
  res.json(genre);
});


export {
  createGenre, updateGenre, removeGenre, listGenres
  , readGenre
};