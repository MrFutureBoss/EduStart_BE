import professionDAO from "../../repositories/professionDAO/index.js";

const getAllProfessions = async (req, res, next) => {
  try {
    const { status, skip, limit, search } = req.query;
    res.send(
      await professionDAO.getAllProfessions(
        status,
        Number.parseInt(skip || 0),
        Number.parseInt(limit || 0),
        search
      )
    );
  } catch (error) {
    next(error);
  }
};

const createNewProfession = async (req, res, next) => {
  try {
    const { name } = req.body;
    res.send(await professionDAO.createNewProfession(name));
  } catch (error) {
    next(error);
  }
};

const updateProfession = async (req, res, next) => {
  try {
    const { status, name } = req.body;
    const { id } = req.params;
    res.send(await professionDAO.updateProfession(id, { status, name }));
  } catch (error) {
    next(error);
  }
};
const patchProfession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    res.send(await professionDAO.patchProfession(id, updateFields));
  } catch (error) {
    next(error);
  }
};
const deleteProfession = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.send(await professionDAO.deleteProfession(id));
  } catch (error) {
    next(error);
  }
};
export default {
  getAllProfessions,
  createNewProfession,
  updateProfession,
  deleteProfession,
  patchProfession,
};
