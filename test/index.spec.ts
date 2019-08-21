import { getLogger, configLogger, winston } from '../src';
import assert from 'assert';
import { Sentry } from '@wenjs/winston-sentry-transport';

const DSN = 'https://53039209a22b4ec1bcc296a3c9fdecd6@sentry.io/4291';

// tslint:disable-next-line:no-namespace
declare global {
  namespace NodeJS {
    // tslint:disable-next-line:interface-name
    interface Global {
      __SENTRY__: any;
    }
  }
}

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
    let logger = configLogger(
      {
        level: 'warn',
        sentryConfig: {
          dsn: DSN
        }
      },
      [new winston.transports.Console()]
    );
    logger = getLogger();
    assert(logger.transports.length);
    const testError: any = new Error('Outside Error Test!');
    // testError.tags = { test: 1 };
    logger.error(testError);
  });
});
