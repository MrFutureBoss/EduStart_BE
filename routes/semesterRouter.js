import express from "express";
import semesterController from "../controllers/semesterController/index.js";

const semesterRouter = express.Router();

semesterRouter.post("/create", semesterController.createSemester);
semesterRouter.put("/update/:semesterId", semesterController.updateSemester);
semesterRouter.get("/all", semesterController.getAllSemesters);
semesterRouter.get("/:semesterId/users", semesterController.getUsersBySemester);

export default semesterRouter;
