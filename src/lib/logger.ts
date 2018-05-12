import winston from 'winston';

const config: any = (winston as any)['config']; // tslint:disable-line:no-string-literal
const logger = new ((winston as any)['Logger']) ({ // tslint:disable-line:no-string-literal
  transports: [
    new (winston.transports.Console) ({
      formatter(options) {
        // - Return string will be passed to logger.
        // - Optionally, use options.colorize(options.level, <string>) to
        //   colorize output based on the log level.
        return config.colorize(options.level, `${options.level}: ${options.message}`);
      },
    }),
  ],
});

export default logger;
