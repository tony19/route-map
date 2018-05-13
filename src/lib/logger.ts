import chalk from 'chalk';

class Logger {
  public log(msg: string) {
    console.log(msg);
  }

  public debug(msg: string) {
    this.log(chalk.gray(msg));
  }

  public info(msg: string) {
    this.log(chalk.white(msg));
  }

  public warn(msg: string) {
    this.log(chalk.yellow(msg));
  }

  public error(msg: string) {
    this.log(chalk.red(msg));
  }
}

const logger = new Logger();
export default logger;
