import User from "../../models/userModel.js";
import Class from "../../models/classModel.js";

// Tìm giáo viên theo userName và role = 2
const findTeacherByUsername = async (username) => {
  try {
    const teacher = await User.findOne({ username, role: 2 }).exec();
    return teacher;
  } catch (error) {
    console.error(`Error finding teacher by username: ${error.message}`);
    throw new Error(error.message);
  }
};

// Tìm hoặc tạo lớp học dựa trên className và teacherId
const findOrCreateClass = async (className, teacherId) => {
  try {
    // Kiểm tra xem lớp đã tồn tại hay chưa
    let classData = await Class.findOne({ className }).lean().exec();

    // Nếu chưa có lớp học, tiến hành tạo mới
    if (!classData) {
      classData = new Class({
        className,
        limitStudent: 30,
        teacherId,
        status: "InActive",
      });
      await classData.save();
    }
    return classData;
  } catch (error) {
    console.error(`Error in findOrCreateClass: ${error.message}`);
    throw new Error(error.message);
  }
};

// Tạo danh sách user mới
const createListUsers = async (listData) => {
  try {
    const users = await User.insertMany(listData);
    return users;
  } catch (error) {
    console.error(`Error creating list of users: ${error.message}`);
    throw new Error(error.message);
  }
};

export default {
  findTeacherByUsername,
  findOrCreateClass,
  createListUsers,
};
