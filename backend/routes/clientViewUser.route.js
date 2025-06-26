import express from "express";
import {
  getAllClientViewUsers,
  newClientViewUser,
  verifyClientToken,
} from "../controller/ClientViewUser.controller.js";

const clientViewUserrouter = express.Router();

clientViewUserrouter.post("/clientvu/newClientViewUser", newClientViewUser);
clientViewUserrouter.get(
  "/clientvu/getAllClientViewUsers/:userId",
  getAllClientViewUsers
);

clientViewUserrouter.post("/clientvu/verifyClientToken", verifyClientToken);

export default clientViewUserrouter;
