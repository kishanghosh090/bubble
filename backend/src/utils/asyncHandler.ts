import type { Request, Response, NextFunction } from "express";

const asyncHandler = (requestHandler: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      console.log(error);
      next(error);
    });
  };
};
export { asyncHandler };
