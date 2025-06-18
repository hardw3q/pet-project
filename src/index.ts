import logger from 'jet-logger';

import server from './server';


server.listen(3000, err => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info('Сервер запущен на порту 3000');
  }
});
