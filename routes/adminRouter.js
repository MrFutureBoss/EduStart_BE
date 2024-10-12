import express from "express";
import adminController from "../controllers/AdminController/index.js";
import multer from "multer";

const adminRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

adminRouter.post(
  "/import-users",
  upload.single("file"),
  adminController.insertListUsers
);
adminRouter.post("/add-user-hand", adminController.insertUserByHand);

adminRouter.get(
  "/:semesterId/available/class",
  adminController.getAvailableClasses
);
adminRouter.post("/assign/student", adminController.assignStudentToClass);
adminRouter.get("/pending-user/:semesterId", adminController.getPendingUsers);

export default adminRouter;
