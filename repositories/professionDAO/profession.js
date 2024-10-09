import mongoose from "mongoose";
import Profession from "../../models/professionModel.js";
import Specialty from "../../models/SpecialtyModel.js";

const getAllProfessions = async (status, skip, limit, search) => {
  try {
    let query = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };
    const result = await Profession.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await Profession.countDocuments({});
    return { data: result, total };
  } catch (error) {
    throw new Error(error);
  }
};
const getAllProfessionsById = async () => {
  try {
  } catch (error) {
    throw new Error(error);
  }
};

const createNewProfession = async (name, specialties, status) => {
  try {
    const specialtyDocs = await Promise.all(
      specialties.map(async (specialty) => {
        const createdSpecialty = await Specialty.create(specialty);
        return createdSpecialty._id; 
      })
    );

    const newProfession = await Profession.create({
      name,
      status,
      specialty: specialtyDocs,
    });

    return newProfession;
  } catch (error) {
    throw new Error(error);
  }
};

const updateProfession = async (id, values) => {
  try {
    return await Profession.findByIdAndUpdate(id, values).exec();
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProfession = async (id) => {
  try {
    return await Profession.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getAllProfessions,
  getAllProfessionsById,
  createNewProfession,
  updateProfession,
  deleteProfession,
};
