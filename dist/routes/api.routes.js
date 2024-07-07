"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const validateUserInput_1 = require("../middlewares/validateUserInput");
const api_controller_1 = require("../controllers/api.controller");
const apiRouter = (0, express_1.Router)();
apiRouter.route("/users/:id").get(verifyUser_1.default, api_controller_1.userDetails);
apiRouter.route("/organisations").get(verifyUser_1.default, api_controller_1.userOrganisationList);
apiRouter.route("/organisations/:orgId").get(verifyUser_1.default, api_controller_1.getParticularUserOrganisation);
apiRouter.route("/organisations").post(verifyUser_1.default, validateUserInput_1.createNewOrganisationValidate, api_controller_1.createNewOrganisation);
apiRouter.route("/organisations/:orgId/users").post(api_controller_1.addUserToOrganisation);
exports.default = apiRouter;
//# sourceMappingURL=api.routes.js.map