"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
function processKeys(req, input) {
    input = _processParamsKeys(req, input);
    input = _processQueryKeys(req, input);
    return _processDataKeys(req, input);
}
exports.processKeys = processKeys;
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
            if (!(p in data)) {
                data = '';
                console.error(chalk_1.default.red("unknown data path: [" + p + "] in \"" + dataPath + "\""));
                break;
            }
            data = data[p];
        }
        return data;
    });
}
//# sourceMappingURL=parser.js.map