import mongoose from "mongoose";
import Specialty from "../../models/SpecialtyModel.js";
const getAllSpecialties = async (status, skip, limit, search) => {
  try {
    let query = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };
    const result = await Specialty.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await Specialty.countDocuments({});
    return { data: result, total };
  } catch (error) {
    throw new Error(error);
  }
};
const getAllSpecialtiesById = async () => {
  try {
  } catch (error) {
    throw new Error(error);
  }
};

const createNewSpecialty = async (name) => {
  try {
    return await Specialty.create({ name });
  } catch (error) {
    throw new Error(error);
  }
};

const updateSpecialty = async (id, values) => {
  try {
    return await Specialty.findByIdAndUpdate(id, values).exec();
  } catch (error) {
    throw new Error(error);
  }
};

const deleteSpecialty = async (id) => {
  try {
    return await Specialty.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getAllSpecialties,
  getAllSpecialtiesById,
  createNewSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
