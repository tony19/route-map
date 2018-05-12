"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var config = winston_1.default['config']; // tslint:disable-line:no-string-literal
var logger = new (winston_1.default['Logger'])({
    transports: [
        new (winston_1.default.transports.Console)({
            formatter: function (options) {
                // - Return string will be passed to logger.
                // - Optionally, use options.colorize(options.level, <string>) to
                //   colorize output based on the log level.
                return config.colorize(options.level, options.level + ": " + options.message);
            },
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map