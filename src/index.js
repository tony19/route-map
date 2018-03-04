const chalk = require('chalk');
const fs = require('fs');

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
function setupRoutes(app, routes) {
  Object.keys(routes).forEach(path => {
    const route = routes[path];
    if (typeof route === 'string') {
      console.debug(chalk.gray(`adding route: GET ${path}`));
      app.get(path, toHandler(route));

    } else if (typeof route === 'object') {
      Object.keys(route).forEach(verb => {
        verb = verb.toLowerCase();
        if (verb in app && app.hasOwnProperty(verb)) {
          console.debug(chalk.gray(`adding route: ${verb.toUpperCase()} ${path}`));
          app[verb].call(app, path, toHandler(route[verb]));
        } else {
          console.warn(chalk.yellow(`ignoring unknown HTTP verb: ${verb}`));
        }
      });

    } else {
      console.warn(chalk.yellow(`ignoring unkonwn route config type: ${typeof route} -> ${route}`));
    }
  });
}

const _handlers = new Set();
function toHandler(value) {
  let handler = value;
  if (typeof value === 'string') {
    if (!_handlers[value]) {
      _handlers[value] = (req, res) => {
        const filename = _processKeys(req, value);
        if (fs.existsSync(filename)) {
          res.json(require(filename));
        } else {
          console.error(chalk.red(`file not found: ${filename}`));
          res.sendStatus(404);
        }
      }
    }
    handler = _handlers[value];
  }
  return handler;
}

function _processKeys(req, input) {
  input = _processParamsKeys(req, input);
  input = _processQueryKeys(req, input);
  return _processDataKeys(req, input);
}

function _processParamsKeys(req, input) {
  return input.replace(/:(\w+)\b/g, (match, ...groups) => req.params[groups[0]]);
}
function _processQueryKeys(req, input) {
  return input.replace(/:\?(\w+)\b/g, (match, ...groups) => req.query[groups[0]]);
}
function _processDataKeys(req, input) {
  return input.replace(/:\{([^}]+)\}/g, (match, ...groups) => {
    const dataPath = groups[0];
    const dataPaths = dataPath.split('.');
    let data = req;
    for (const p of dataPaths) {
      data = data[p];
      if (!data) {
        data = ''
        console.error(chalk.red(`unknown data path: [${p}] in "${dataPath}"`));
        break;
      }
    }
    return data;
  });
}

/**
 * @returns A request handler that responds with the given JSON data.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
function json(strings, ...keys) {
  return function json(req, res, next) {
    const output = _processKeys(req, strings.join(''));
    res.json(JSON.parse(output));
  };
}

/**
 * @returns A request handler that responds with the given text.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
function text(strings, ...keys) {
  return function text(req, res, next) {
    const output = _processKeys(req, strings.join(''));
    res.send(output);
  };
}

module.exports = {
  setupRoutes,
  json,
  text
};
