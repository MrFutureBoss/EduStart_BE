import express from "express";
import userController from "../controllers/userController/index.js";

const userRouters= express.Router();

userRouters.post("/login", userController.getUserLogin);
userRouters.post("/forgot_password", userController.forgotPassword);
userRouters.post("/reset_password", userController.resetPassword);
export default userRouters;