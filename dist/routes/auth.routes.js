"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateUserInput_1 = require("../middlewares/validateUserInput");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
authRouter.route("/register").post(validateUserInput_1.registerInputValidate, auth_controller_1.registerUser);
authRouter.route("/login").post(validateUserInput_1.loginInputValidate, auth_controller_1.loginUser);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map