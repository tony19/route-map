"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("@/lib/logger"));
var resolver_1 = require("@/lib/resolver");
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
        var tmplKeys = keys.map(toKeyStrings).map(function (key) { return resolver_1.resolveKeys(req, key); });
        var tmplStr = strings.reduce(function (p, c, i) { return "" + p + tmplKeys[i - 1] + c; });
        var tmplObj = JSON.parse(tmplStr);
        Object.keys(tmplObj).map(toKeyStrings).forEach(function (key) {
            // replace object key with resolved key
            var k = resolver_1.resolveKeys(req, key);
            if (k) {
                if (k !== key) {
                    tmplObj[k] = tmplObj[key];
                    delete tmplObj[key];
                }
            }
            else {
                logger_1.default.error("unknown key in JSON key: " + key);
            }
            if (k) {
                // replace object value with resolved value
                var v = resolver_1.resolveKeys(req, tmplObj[k]);
                if (v) {
                    if (v !== tmplObj[k]) {
                        tmplObj[k] = v;
                    }
                }
                else {
                    logger_1.default.error("unknown key in JSON value: " + k);
                }
            }
        });
        res.json(tmplObj);
    };
}
exports.json = json;
function toKeyStrings(k) {
    if (typeof k !== 'string') {
        // if key is a function, call it to get intended key
        while (k.call) {
            k = k();
        }
        k = k.toString();
    }
    return k;
}
//# sourceMappingURL=json.js.map