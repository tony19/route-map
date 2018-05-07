"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resolver_1 = require("@/lib/resolver");
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
        var output = resolver_1.resolveKeys(req, strings.join(''));
        res.send(output);
    };
}
exports.text = text;
//# sourceMappingURL=text.js.map