import { Router } from "express";
import { loginInputValidate, registerInputValidate } from "../middlewares/validateUserInput";
import {
  registerUser,
  loginUser
} from "../controllers/auth.controller";

const authRouter = Router();
authRouter.route("/register").post(registerInputValidate, registerUser);
authRouter.route("/login").post(loginInputValidate, loginUser);

export default authRouter;