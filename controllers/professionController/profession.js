import professionDAO from "../../repositories/professionDAO/index.js";

const getAllProfessions = async (req, res, next) => {
  try {
    const { status, search, limit = 10, page = 1 } = req.query;

    // Convert `limit` and `page` to integers (default limit to 10, default page to 1)
    const limitInt = parseInt(limit, 10);
    const pageInt = parseInt(page, 10);

    // Calculate the number of documents to skip for pagination
    const skip = (pageInt - 1) * limitInt;

    // Call the DAO with the calculated `skip`, `limit`, and other filters
    const professions = await professionDAO.getAllProfessions(
      status,
      skip,
      limitInt,
      search
    );

    // Respond with paginated results
    res.status(200).json(professions); // Return the data and total count
  } catch (error) {
    next(error);
  }
};

const getProfessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profession = await professionDAO.getProfessionById(id);

    if (!profession) {
      return res.status(404).json({ message: "Profession not found" });
    }

    res.status(200).json(profession);
  } catch (error) {
    next(error);
  }
};

const createNewProfession = async (req, res, next) => {
  try {
    const { name, specialties, status } = req.body;
    const newProfession = await professionDAO.createNewProfession(
      name,
      specialties,
      status
    );
    res.status(201).send(newProfession);
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

const deleteProfessionAndSpecialties = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await professionDAO.deleteProfessionAndSpecialties(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export default {
  getAllProfessions,
  getProfessionById,
  createNewProfession,
  updateProfession,
  deleteProfessionAndSpecialties,
};
