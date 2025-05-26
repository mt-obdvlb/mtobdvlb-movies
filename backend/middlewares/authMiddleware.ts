import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import type { IUser } from '../models/User.ts'
import User from '../models/User.ts'
import asyncHandler from './asyncHandler.ts'
import type { NextFunction, Request, Response } from 'express'

export interface AuthRequest extends Request {
  user?: IUser
}

const authenticate = asyncHandler(async (req: AuthRequest, res, next) => {
  let token

  token = req.cookies.jwt

  if (token) {
    const jwtSecret = process.env.JWT_SECRET as string
    if (!jwtSecret) {
      throw new Error('JWT_SECRET没有定义')
    }
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload
      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      res.status(401)
      throw new Error('没有验证')
    }
  } else {
    res.status(401)
    throw new Error('没有验证')
  }
})

const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).send('不是管理员账号')
  }
}

export { authenticate, authorizeAdmin }
