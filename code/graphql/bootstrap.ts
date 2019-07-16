import { LoggingEvent } from 'log4js';
import * as log4js from 'log4js';

export function bootstrap() {
  mock();
  configureLogger();
}

function configureLogger() {
  log4js.addLayout('json', (conf) => (logEvent) => JSON.stringify(logEvent));
  log4js.configure({
    appenders: {
      json: {
        type: 'stdout',
        layout: {
          type: 'json',
        },
      },
      text: {
        type: 'stdout',
        layout: {
          type: 'basic',
        },
      },
      message: {
        type: 'stdout',
        layout: {
          type: 'messagePassThrough',
        },
      },
      simple: {
        type: 'stdout',
        layout: {
          type: 'pattern',
          pattern: '%d %p %x{f}(%l) %x{sig} %m',
          tokens: {
            sig: (logEvent: any) => logEvent.functionName,
            f: (logEvent: any) => {
              const parts = logEvent.fileName.split('/');
              return parts.slice(parts.length - 1).join('/');
            },
            class: (logEvent: any) => logEvent.functionName.split('.')[0],
            fn: (logEvent: any) => logEvent.functionName.split('.')[1],
          },
        },
      },
    },
    categories: {
      default: {
        appenders: ['simple'],
        level: process.env.LOGLEVEL as string,
        enableCallStack: true,
      },
    },
  });
}

export function mock() {
  process.env.LOGLEVEL = 'debug';
}
