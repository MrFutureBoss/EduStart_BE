import specialtyDAO from "../../repositories/specialtyDAO/index.js";

const getAllSpecailties = async (req, res, next) => {
  try {
    const { status, skip, limit, search } = req.query;
    res.send(
      await specialtyDAO.getAllSpecailties(
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

const createNewSpecialty = async (req, res, next) => {
  try {
    const { name } = req.body;
    res.send(await specialtyDAO.createNewSpecialty(name));
  } catch (error) {
    next(error);
  }
};

const updateSpecialty = async (req, res, next) => {
  try {
    const { status, name } = req.body;
    const { id } = req.params;
    res.send(await specialtyDAO.updateSpecialty(id, { status, name }));
  } catch (error) {
    next(error);
  }
};
const deleteSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.send(await specialtyDAO.deleteSpecialty(id));
  } catch (error) {
    next(error);
  }
};
export default {
  getAllSpecailties,
  createNewSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
