"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// register module path mappings (in package.json)
require("module-alias/register");
var setup_routes_1 = require("@/lib/setup-routes");
exports.setupRoutes = setup_routes_1.setupRoutes;
var json_1 = require("@/lib/handlers/json");
exports.json = json_1.json;
var text_1 = require("@/lib/handlers/text");
exports.text = text_1.text;
//# sourceMappingURL=index.js.map