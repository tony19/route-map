"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.log = function (msg) {
        console.log(msg);
    };
    Logger.prototype.debug = function (msg) {
        this.log(chalk_1.default.gray(msg));
    };
    Logger.prototype.info = function (msg) {
        this.log(chalk_1.default.white(msg));
    };
    Logger.prototype.warn = function (msg) {
        this.log(chalk_1.default.yellow(msg));
    };
    Logger.prototype.error = function (msg) {
        this.log(chalk_1.default.red(msg));
    };
    return Logger;
}());
var logger = new Logger();
exports.default = logger;
//# sourceMappingURL=logger.js.map