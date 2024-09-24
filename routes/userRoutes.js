import express from "express";
import userController from "../controllers/userController/index.js";

const userRouters= express.Router();

userRouters.post("/login", userController.getUserLogin);

export default userRouters;