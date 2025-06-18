import { Request, Response, NextFunction } from 'express';
import logger from './logger';
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {

  logger.info( `Новый запрос ${req.method} ${req.originalUrl}\n ${JSON.stringify(req.query)} ${JSON.stringify(req.body)} `);

  res.on('finish', () => {
    logger.info(`${res.statusCode}: ${req.method} ${req.originalUrl}}`);
  });

  res.on('error', (err) => {
    logger.error('Ошибка' + err.message);
  });

  next();
};