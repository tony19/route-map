import logger from '@/lib/logger';

/**
 * Resolves keys in a given pattern based on properties found
 * in `req` (http://expressjs.com/en/api.html#req). The keys
 * can be from:
 *
 *   req.query  -->  `:?QUERY_KEY`    ex: ":?utm"
 *   req.params -->  `:PARAM_KEY`     ex: ":id"
 *   req        -->  `:{DATA_PATH}`   ex: ":{baseUrl}"
 *
 * Example:
 *  Given:
 *    req.originalUrl = "http://example.com/2"
 *    req.params.foo  = "2"
 *    req.query.q     = "google"
 *    input = "/:foo/:?q/:{originalUrl}/x"
 *  Returns:
 *    "/2/google/http://example.com/2/index.html"
 * @param req request object
 * @param input input pattern
 * @return the input pattern with the keys replaced
 */
export function resolveKeys(req: any, input: string) {
  if (!input) {
    return '';
  }
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
 *    input = "/:foo/:bar/index.html"
 *  Returns:
 *    "/2/apple/index.html"
 * @param req request object
 * @param input input pattern
 * @returns the input pattern with the param-keys replaced by param-values
 */
export function resolveParamsKeys(req: any, input: string) {
  return input.replace(/:([^{}\/&?]+)/g, (match, ...groups) => {
    const key = groups[0];
    if (!(key in req.params)) {
      logger.error(`unknown param key: ${key}`);
    }
    return req.params[key] || '';
  });
}

/**
 * Resolves `:?QUERY_KEY` strings in a given pattern based on
 * `req.query` (http://expressjs.com/en/api.html#req.query)
 *
 * Example:
 *  Given:
 *    req.query.foo = "2"
 *    req.query.bar = "apple"
 *    input = "/:foo/:bar/index.html"
 *  Returns:
 *    "/2/apple/index.html"
 * @param req request object
 * @param input input pattern
 * @return the input pattern with the query-keys replaced by query-values
 */
export function resolveQueryKeys(req: any, input: string) {
  return input.replace(/:\?([^\/&?]+)/g, (match, ...groups) => {
    const key = groups[0];
    if (!(key in req.query)) {
      logger.error(`unknown query key: ${key}`);
    }
    return req.query[key] || '';
  });
}

/**
 * Resolves `:{DATA_KEY}` strings in a given pattern based on
 * properties of `req` (http://expressjs.com/en/api.html#req)
 *
 * Example:
 *  Given:
 *    req.baseUrl = "http://example.com"
 *    input = ":{baseUrl}/index.html"
 *  Returns:
 *    "http://example.com/index.html"
 * @param req request object
 * @param input input pattern
 * @return the input pattern with the data-keys replaced by data-values
 */
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
