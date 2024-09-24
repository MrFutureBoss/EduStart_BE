import mongoose from "mongoose";
import Profession from "../../models/professionModel.js";
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

const createNewProfession = async (name) => {
  try {
    return await Profession.create({ name });
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
