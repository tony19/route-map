import chalk from 'chalk';
import fs from 'fs';
import {METHODS} from 'http';
import { IRouteConfig, RequestHandler } from './lib/route-config';

const methodsPattern = new RegExp(METHODS.join('|'), 'ig');

/**
 * Sets up server routes
 *
 * EXAMPLE 1:
 *  input:
 *    {'/api/v1/foo/:id': `/path/to/data/:id.json`}
 *
 *  result:
 *    app.get('/api/v1/foo/:id', (req, res, next) => {
 *      res.json(require(`/path/to/data/${req.params.id}.json`));
 *    });
 *
 * EXAMPLE 2:
 *  input:
 *    {
 *      '/api/v1/foo/:bar': {
 *        get: `/path/to/:bar.json`,
 *        delete: `/path/to/ok.json`,
 *        put(req, res, next) {
 *          console.log('putting data');
 *          res.json({success: true});
 *        }
 *      }
 *    }
 *
 *  result:
 *    app.get('/api/v1/foo/:bar', (req, res, next) => {
 *      res.json(require(`/path/to/${req.params.bar}.json`));
 *    });
 *    app.delete('/api/v1/foo/:bar', (req, res, next) => {
 *      res.json(require(`/path/to/ok.json`));
 *    });
 *    app.put('/api/v1/foo/:bar', (req, res, next) => {
 *      console.log('putting data');
 *      res.json({success: true});
 *    });
 */
export function setupRoutes(app: any, routes: IRouteConfig) {
  for (const [path, route] of Object.entries(routes)) {
    if (typeof route === 'string') {
      console.debug(chalk.gray(`adding route: GET ${path}`));
      app.get(path, toHandler(route));

    } else if (typeof route === 'object') {
      for (let [verb, handler] of Object.entries(route)) {
        if (methodsPattern.test(verb)) {
          verb = verb.toLowerCase();
        }
        if (verb in app && app.hasOwnProperty(verb)) {
          console.debug(chalk.gray(`adding route: ${verb.toUpperCase()} ${path}`));
          app[verb].call(app, path, toHandler(handler as any));
        } else {
          console.warn(chalk.yellow(`ignoring unknown HTTP verb: ${verb}`));
        }
      }

    } else {
      console.warn(chalk.yellow(`ignoring unknown route config type: ${typeof route} -> ${route}`));
    }
  }
}

const allHandlers: {[key: string]: RequestHandler} = {};
function toHandler(value: string | RequestHandler): RequestHandler {
  let handler = value as RequestHandler;
  if (typeof value === 'string') {
    if (!allHandlers[value]) {
      allHandlers[value] = (req: any, res: any) => {
        const filename = _processKeys(req, value);
        if (fs.existsSync(filename)) {
          res.json(require(filename));
        } else {
          console.error(chalk.red(`file not found: ${filename}`));
          res.sendStatus(404);
        }
      };
    }
    handler = allHandlers[value];
  }
  return handler;
}

function _processKeys(req: any, input: string) {
  input = _processParamsKeys(req, input);
  input = _processQueryKeys(req, input);
  return _processDataKeys(req, input);
}

function _processParamsKeys(req: any, input: string) {
  return input.replace(/:(\w+)\b/g, (match, ...groups) => req.params[groups[0]]);
}
function _processQueryKeys(req: any, input: string) {
  return input.replace(/:\?(\w+)\b/g, (match, ...groups) => req.query[groups[0]]);
}
function _processDataKeys(req: any, input: string) {
  return input.replace(/:\{([^}]+)\}/g, (match, ...groups) => {
    const dataPath = groups[0];
    const dataPaths = dataPath.split('.');
    let data = req;
    for (const p of dataPaths) {
      if (!(p in data)) {
        data = '';
        console.error(chalk.red(`unknown data path: [${p}] in "${dataPath}"`));
        break;
      }
      data = data[p];
    }
    return data;
  });
}

/**
 * @returns A request handler that responds with the given JSON data.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
export function json(strings: string[], ...keys: string[]) {
  return function _json(req: any, res: any) {
    const output = _processKeys(req, strings.join(''));
    res.json(JSON.parse(output));
  };
}

/**
 * @returns A request handler that responds with the given text.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
export function text(strings: string[], ...keys: string[]) {
  return function _text(req: any, res: any) {
    const output = _processKeys(req, strings.join(''));
    res.send(output);
  };
}
