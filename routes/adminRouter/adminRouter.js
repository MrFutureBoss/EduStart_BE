import express from "express";
import adminController from "../../controllers/AdminController/index.js";
import multer from "multer";

const adminRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

adminRouter.post(
  "/import-users",
  upload.single("file"),
  adminController.insertListUsers
);

export default adminRouter;
