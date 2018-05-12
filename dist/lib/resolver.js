"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("@/lib/logger"));
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
function resolveKeys(req, input) {
    if (!input) {
        return '';
    }
    input = resolveParamsKeys(req, input);
    input = resolveQueryKeys(req, input);
    return resolveDataKeys(req, input);
}
exports.resolveKeys = resolveKeys;
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
function resolveParamsKeys(req, input) {
    return input.replace(/:([^{}\/&?]+)/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        var key = groups[0];
        if (!(key in req.params)) {
            logger_1.default.error("unknown param key: " + key);
        }
        return req.params[key] || '';
    });
}
exports.resolveParamsKeys = resolveParamsKeys;
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
function resolveQueryKeys(req, input) {
    return input.replace(/:\?([^\/&?]+)/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        var key = groups[0];
        if (!(key in req.query)) {
            logger_1.default.error("unknown query key: " + key);
        }
        return req.query[key] || '';
    });
}
exports.resolveQueryKeys = resolveQueryKeys;
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
function resolveDataKeys(req, input) {
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
            if (typeof data !== 'object') {
                data = '';
                logger_1.default.error("invalid/primitive data path: [" + p + "] in \"" + dataPath + "\"");
                break;
            }
            else if (!(p in data)) {
                data = '';
                logger_1.default.error("unknown data path: [" + p + "] in \"" + dataPath + "\"");
                break;
            }
            data = data[p];
        }
        if (typeof data === 'object') {
            data = '';
            logger_1.default.error("invalid data path: \"" + dataPath + "\"");
        }
        return data;
    });
}
exports.resolveDataKeys = resolveDataKeys;
//# sourceMappingURL=resolver.js.map