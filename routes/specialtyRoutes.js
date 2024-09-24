import express from "express";
import specialtyController from "../controllers/specialtyController/index.js";

const specialtyRouters= express.Router();

specialtyRouters.get("/", specialtyController.getAllSpecailties);
specialtyRouters.post("/", specialtyController.createNewSpecialty);
specialtyRouters.patch("/:id", specialtyController.updateSpecialty);
specialtyRouters.delete("/:id", specialtyController.getAllSpecailties);
export default specialtyRouters;