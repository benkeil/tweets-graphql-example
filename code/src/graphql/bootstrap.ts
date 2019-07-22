import * as log4js from 'log4js';
import { Container } from 'typedi';

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
          pattern: '%d{hh.mm.ss.SSS} %5p %20x{f}(%l) %20x{fn}: %m',
          tokens: {
            sig: (logEvent: any) => logEvent.functionName,
            f: (logEvent: any) => {
              const parts = logEvent.fileName.split('/');
              return parts.slice(parts.length - 1).join('/');
            },
            class: (logEvent: any) => getPart(logEvent.functionName, 0),
            fn: (logEvent: any) => getPart(logEvent.functionName, 1),
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

const getPart = (functionName: string, part: number): string => {
  if (functionName && functionName.includes('.')) {
    const parts = functionName.split('.');
    if (parts) {
      return parts[part];
    }
  }
  return 'undefined';
};

export function mock() {
  process.env.LOGLEVEL = 'debug';
}
