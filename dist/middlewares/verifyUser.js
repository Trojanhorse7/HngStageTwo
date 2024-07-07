"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JwtSecret = process.env.JWT_SECRET;
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                status: 'Bad request',
                message: 'No Auth Token',
                statusCode: 401,
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Error occured, try again',
            statusCode: 401,
        });
    }
};
exports.default = auth;
//# sourceMappingURL=verifyUser.js.map