"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
var http_methods_1 = require("./lib/http-methods");
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
            console.debug(chalk_1.default.gray("adding route: GET " + path));
            app.get(path, toHandler(route));
        }
        else if (typeof route === 'object') {
            for (var _c = 0, _d = Object.entries(route); _c < _d.length; _c++) {
                var _e = _d[_c], verb = _e[0], handler = _e[1];
                if (http_methods_1.methodsPattern.test(verb)) {
                    verb = verb.toLowerCase();
                }
                if (verb in app && app.hasOwnProperty(verb)) {
                    console.debug(chalk_1.default.gray("adding route: " + verb.toUpperCase() + " " + path));
                    app[verb].call(app, path, toHandler(handler));
                }
                else {
                    console.warn(chalk_1.default.yellow("ignoring unknown HTTP verb: " + verb));
                }
            }
        }
        else {
            console.warn(chalk_1.default.yellow("ignoring unknown route config type: " + typeof route + " -> " + route));
        }
    }
}
exports.setupRoutes = setupRoutes;
var allHandlers = {};
function toHandler(value) {
    var handler = value;
    if (typeof value === 'string') {
        if (!allHandlers[value]) {
            allHandlers[value] = function (req, res) {
                var filename = _processKeys(req, value);
                if (fs_1.default.existsSync(filename)) {
                    res.json(require(filename));
                }
                else {
                    console.error(chalk_1.default.red("file not found: " + filename));
                    res.sendStatus(404);
                }
            };
        }
        handler = allHandlers[value];
    }
    return handler;
}
function _processKeys(req, input) {
    input = _processParamsKeys(req, input);
    input = _processQueryKeys(req, input);
    return _processDataKeys(req, input);
}
function _processParamsKeys(req, input) {
    return input.replace(/:(\w+)\b/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        return req.params[groups[0]];
    });
}
function _processQueryKeys(req, input) {
    return input.replace(/:\?(\w+)\b/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        return req.query[groups[0]];
    });
}
function _processDataKeys(req, input) {
    return input.replace(/:\{([^}]+)\}/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        var dataPath = groups[0];
        var dataPaths = dataPath.split('.');
        var data = req;
        for (var _a = 0, dataPaths_1 = dataPaths; _a < dataPaths_1.length; _a++) {
            var p = dataPaths_1[_a];
            data = data[p];
            if (!data) {
                data = '';
                console.error(chalk_1.default.red("unknown data path: [" + p + "] in \"" + dataPath + "\""));
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
function json(strings) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return function _json(req, res) {
        var output = _processKeys(req, strings.join(''));
        res.json(JSON.parse(output));
    };
}
exports.json = json;
/**
 * @returns A request handler that responds with the given text.
 * The data is formatted (special keys are replaced) and then converted
 * into a JSON object before being sent.
 */
function text(strings) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return function _text(req, res) {
        var output = _processKeys(req, strings.join(''));
        res.send(output);
    };
}
exports.text = text;
//# sourceMappingURL=index.js.map