import express from "express";
import professionController from "../controllers/professionController/index.js";

const professionRouters = express.Router();

professionRouters.get("/", professionController.getAllProfessions);
professionRouters.get("/:id", professionController.getProfessionById);
professionRouters.post("/", professionController.createNewProfession);
professionRouters.patch("/:id", professionController.updateProfession);
professionRouters.delete("/:id", professionController.deleteProfessionAndSpecialties);

export default professionRouters;