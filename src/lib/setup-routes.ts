import { toRequestHandler } from '@/lib/handlers';
import logger from '@/lib/logger';
import { IRouteConfig } from '@/lib/route-config';
import { METHODS } from 'http';

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
  for (let [path, route] of Object.entries(routes)) {
    if (typeof route === 'string') {
      route = { get: path };
    }
    if (typeof route === 'object') {
      const methodsPattern = new RegExp(METHODS.join('|'), 'ig');
      for (let [verb, handler] of Object.entries(route)) {
        if (methodsPattern.test(verb)) {
          verb = verb.toLowerCase();
        }
        if (verb in app && app.hasOwnProperty(verb)) {
          logger.debug(`adding route: ${verb.toUpperCase()} ${path}`);
          app[verb].call(app, path, toRequestHandler(handler as any));
        } else {
          logger.warn(`ignoring unknown HTTP verb: ${verb}`);
        }
      }

    } else {
      logger.warn(`ignoring unknown route config type: ${typeof route} -> ${route}`);
    }
  }
}
