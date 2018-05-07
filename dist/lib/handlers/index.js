"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("@/lib/logger"));
var resolver_1 = require("@/lib/resolver");
var fs_1 = __importDefault(require("fs"));
var allHandlers = {};
function toRequestHandler(value) {
    var handler = value;
    if (typeof value === 'string') {
        if (!allHandlers[value]) {
            allHandlers[value] = function (req, res) {
                var filename = resolver_1.resolveKeys(req, value);
                if (fs_1.default.existsSync(filename)) {
                    res.json(require(filename));
                }
                else {
                    logger_1.default.error("file not found: " + filename);
                    res.sendStatus(404);
                }
            };
        }
        handler = allHandlers[value];
    }
    return handler;
}
exports.toRequestHandler = toRequestHandler;
//# sourceMappingURL=index.js.map