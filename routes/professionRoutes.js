import express from "express";
import professionController from "../controllers/professionController/index.js";

const professionRouters = express.Router();

professionRouters.get("/", professionController.getAllProfessions);
professionRouters.post("/", professionController.createNewProfession);
professionRouters.patch("/:id", professionController.updateProfession);
professionRouters.delete("/:id", professionController.deleteProfession);
export default professionRouters;