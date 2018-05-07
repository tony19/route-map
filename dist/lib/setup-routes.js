"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var handlers_1 = require("@/lib/handlers");
var logger_1 = __importDefault(require("@/lib/logger"));
var http_1 = require("http");
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
    for (var _i = 0, _a = Object.entries(routes); _i < _a.length; _i++) {
        var _b = _a[_i], path = _b[0], route = _b[1];
        if (typeof route === 'string') {
            logger_1.default.debug("adding route: GET " + path);
            app.get(path, handlers_1.toRequestHandler(route));
        }
        else if (typeof route === 'object') {
            var methodsPattern = new RegExp(http_1.METHODS.join('|'), 'ig');
            for (var _c = 0, _d = Object.entries(route); _c < _d.length; _c++) {
                var _e = _d[_c], verb = _e[0], handler = _e[1];
                if (methodsPattern.test(verb)) {
                    verb = verb.toLowerCase();
                }
                if (verb in app && app.hasOwnProperty(verb)) {
                    logger_1.default.debug("adding route: " + verb.toUpperCase() + " " + path);
                    app[verb].call(app, path, handlers_1.toRequestHandler(handler));
                }
                else {
                    logger_1.default.warn("ignoring unknown HTTP verb: " + verb);
                }
            }
        }
        else {
            logger_1.default.warn("ignoring unknown route config type: " + typeof route + " -> " + route);
        }
    }
}
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=setup-routes.js.map