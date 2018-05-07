import logger from '@/lib/logger';

export function resolveKeys(req: any, input: string) {
  input = resolveParamsKeys(req, input);
  input = resolveQueryKeys(req, input);
  return resolveDataKeys(req, input);
}

/**
 * Resolves `:PARAM_KEY` strings in a given pattern based on
 * `req.params` (http://expressjs.com/en/api.html#req.params)
 *
 * Example:
 *  Given:
 *    req.originalUrl = "http://example.com/2/apple/index.html"
 *    req.params.foo  = "2"
 *    req.params.bar  = "apple"
 *    input = "http://example.com/:foo/:bar/index.html"
 *  Returns:
 *    "http://example.com/2/apple/index.html"
 * @param req request object
 * @param input input pattern
 * @return the input pattern with the param-keys replaced by param-values
 */
export function resolveParamsKeys(req: any, input: string) {
  return input.replace(/:([^\/&?]+)/g, (match, ...groups) => req.params[groups[0]] || '');
}

/**
 * Resolves `:?QUERY_KEY` strings in a given pattern based on
 * `req.params` (http://expressjs.com/en/api.html#req.query)
 *
 * Example:
 *  Given:
 *    req.params.foo = "2"
 *    req.params.bar = "apple"
 *    input = "http://example.com/:foo/:bar/index.html"
 *  Returns:
 *    "http://example.com/2/apple/index.html"
 * @param req request object
 * @param input input pattern
 * @return the input pattern with the param-keys replaced by param-values
 */
export function resolveQueryKeys(req: any, input: string) {
  return input.replace(/:\?([^\/&?]+)/g, (match, ...groups) => req.query[groups[0]] || '');
}

export function resolveDataKeys(req: any, input: string) {
  return input.replace(/:\{([^}]+)\}/g, (match, ...groups) => {
    const dataPath = groups[0];
    const dataPaths = dataPath.split('.');
    let data = req;
    for (const p of dataPaths) {
      if (typeof data !== 'object') {
        data = '';
        logger.error(`invalid/primitive data path: [${p}] in "${dataPath}"`);
        break;
      } else if (!(p in data)) {
        data = '';
        logger.error(`unknown data path: [${p}] in "${dataPath}"`);
        break;
      }
      data = data[p];
    }

    if (typeof data === 'object') {
      data = '';
      logger.error(`invalid data path: "${dataPath}"`);
    }
    return data;
  });
}
