import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import { createNewOrganisationValidate } from "../middlewares/validateUserInput";
import {
  userDetails,
  userOrganisationList,
  getParticularUserOrganisation,
  addUserToOrganisation,
  createNewOrganisation
} from "../controllers/api.controller";

const apiRouter = Router();

apiRouter.route("/users/:id").get(verifyUser, userDetails);
apiRouter.route("/organisations").get(verifyUser, userOrganisationList);
apiRouter.route("/organisations/:orgId").get(verifyUser, getParticularUserOrganisation);
apiRouter.route("/organisations").post(verifyUser, createNewOrganisationValidate, createNewOrganisation);
apiRouter.route("/organisations/:orgId/users").post(addUserToOrganisation);

export default apiRouter;