import type {
  Request,
  Response,
  NextFunction,
  RequestHandler
} from 'express';

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        res.status(500).json({
          message: error.message
        })
      });
  }
}

export default asyncHandler;