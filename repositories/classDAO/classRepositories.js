import User from "../../models/userModel.js";
import Class from "../../models/classModel.js";

// hàm để lấy số lượng học sinh trong lớp theo classId
const getStudentCountByClassId = async (classId) => {
  try {
    const studentCount = await User.countDocuments({ classId });
    return studentCount;
  } catch (error) {
    console.error(`Error in getStudentCountByClassId: ${error.message}`);
    throw new Error("Lỗi khi đếm số lượng học sinh trong lớp.");
  }
};

// hàm để lấy thông tin của lớp theo classId
const getClassById = async (classId) => {
  try {
    const classData = await Class.findById(classId);
    return classData;
  } catch (error) {
    console.error(`Error in getClassById: ${error.message}`);
    throw new Error("Lỗi khi lấy thông tin lớp.");
  }
};

export default {
  getStudentCountByClassId,
  getClassById,
};
