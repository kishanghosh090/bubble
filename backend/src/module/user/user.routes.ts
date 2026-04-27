import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/profile", UserController.getProfile);

router.get("/search/:q", UserController.searchUsers);

export default router;
