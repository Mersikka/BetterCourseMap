import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[error]', err);
  const status = (err as any)?.status || 500;
  res.status(status).json({
    error: {
      message: (err as any)?.message || 'Internal Server Error'
    }
  });
};
