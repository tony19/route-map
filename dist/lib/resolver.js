"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("@/lib/logger"));
function resolveKeys(req, input) {
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
 *    input = "http://example.com/:foo/:bar/index.html"
 *  Returns:
 *    "http://example.com/2/apple/index.html"
 * @param req request object
 * @param input input pattern
 * @return the input pattern with the param-keys replaced by param-values
 */
function resolveParamsKeys(req, input) {
    return input.replace(/:(\w+)\b/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        return req.params[groups[0]];
    });
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
function resolveQueryKeys(req, input) {
    return input.replace(/:\?(\w+)\b/g, function (match) {
        var groups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            groups[_i - 1] = arguments[_i];
        }
        return req.query[groups[0]];
    });
}
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
            if (!(p in data)) {
                data = '';
                logger_1.default.error("unknown data path: [" + p + "] in \"" + dataPath + "\"");
                break;
            }
            data = data[p];
        }
        return data;
    });
}
//# sourceMappingURL=resolver.js.map