import express from "express";
import semesterController from "../controllers/semesterController/index.js";

const semesterRouter = express.Router();

// Route để lấy danh sách các kỳ học có trạng thái 'Upcoming'
semesterRouter.get("/upcoming", semesterController.getUpcomingSemesters);

export default semesterRouter;
