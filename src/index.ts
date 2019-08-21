import { SentryTransport, ISentryTransportOption, Sentry } from '@wenjs/winston-sentry-transport';
import winstonTransport from 'winston-transport';
import { RewriteFrames } from '@sentry/integrations';
import winston from 'winston';

type LoggerConfig = Pick<ISentryTransportOption, 'sentryConfig'>;

interface ILogConfig extends LoggerConfig {
  level: string;
}

// tslint:disable:no-unused-expression
let logger: winston.Logger;

const log = (info: any, next: () => void) => {
  const { level } = info;
  // tslint:disable-next-line:no-console
  Sentry.withScope((scope) => {
    scope.setTags({ test: '1' });
    info.extras && scope.setExtras(info.extras);
    if (info.contexts) {
      for (const key in info.contexts) {
        if (info.contexts.hasOwnProperty(key)) {
          const element = info.context[key];
          element && scope.setContext(key, element);
        }
      }
    }
    switch (level) {
      case 'error':
        Sentry.captureException(info);
        break;
      case 'warn':
        Sentry.captureMessage(info.message, Sentry.Severity.Warning);
      case 'log':
        Sentry.captureMessage(info.message, Sentry.Severity.Log);
      case 'info':
        Sentry.captureMessage(info.message, Sentry.Severity.Info);
      default:
        Sentry.captureMessage(info.message);
        break;
    }
    next();
  });
};

const defaultSentryTransport: ILogConfig = {
  level: 'error',
  sentryConfig: {
    environment: process.env.NODE_ENV,
    integrations: [
      new RewriteFrames({
        root: __dirname || process.cwd()
      })
    ]
  }
};

/**
 * configLogger
 * @param config config
 */
const configLogger = (conf: ILogConfig, transports: winstonTransport[] = []): winston.Logger => {
  const config = Object.assign({}, defaultSentryTransport, conf);
  const sentryTransport = new SentryTransport({
    log,
    level: config.level,
    sentryConfig: config.sentryConfig
  });
  transports.push(sentryTransport);
  logger = winston.createLogger({
    transports
  });
  return logger;
};

/**
 * get logger
 */
const getLogger = () => {
  if (!getLogger) throw new Error('Not initialized! Please call `configLogger` first.');
  return logger;
};
export { winston, configLogger, getLogger };
