import { isValidObjectId } from 'mongoose'

const checkId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404)
    throw new Error('非法ID' + req.params.id)
  }
  next()
}

export default checkId
