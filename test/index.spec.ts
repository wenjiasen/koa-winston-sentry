import { getLogger, configLogger, winston } from '../src';
import assert from 'assert';

const DSN = 'https://21130e0099b442ff93dc9813745dd776@Your-Sentry-DSN/1';

describe('Test Error', () => {
  it('logs error levels', () => {
    const error = new Error('Test Error!');
    configLogger({
      level: 'warn',
      sentryConfig: {
        dsn: DSN
      }
    });
    const logger = getLogger();
    logger.error(error);
  });
  it('outside Logger Instance', () => {
    const logger = winston.createLogger({
      level: 'info',
      transports: [new winston.transports.Console()]
    });
    configLogger(
      {
        level: 'warn',
        sentryConfig: {
          dsn: DSN
        }
      },
      logger
    );
    logger.error(new Error('Outside Error Test!'));
  });
});
