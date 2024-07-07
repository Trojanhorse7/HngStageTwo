"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
//ROUTES IMPORTS
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
//SINGLE PRISMA CLIENT FOR ALL
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
//MIDDLEWARES
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// API ROUTES
app.use("/auth", auth_routes_1.default);
app.use("/api", api_routes_1.default);
// CATCH UNREGISTERED ROUTES
app.all("*", (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
exports.default = app;
//# sourceMappingURL=app.js.map