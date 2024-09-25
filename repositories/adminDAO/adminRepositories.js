import User from "../../models/userModel.js";
import Class from "../../models/classModel.js";

// tìm giáo viên theo userName và role = 2
const findTeacherByUsername = async (username) => {
  try {
    const teacher = await User.findOne({ username, role: 2 }).exec();
    return teacher;
  } catch (error) {
    console.error(`Error finding teacher by username: ${error.message}`);
    throw new Error(error.message);
  }
};

// tìm hoặc tạo lớp học dựa trên className và teacherId
const findOrCreateClass = async (className, teacherId) => {
  try {
    let classData = await Class.findOne({ className }).lean().exec();

    if (!classData) {
      classData = new Class({
        className,
        limitStudent: 30,
        teacherId,
        status: "InActive",
      });
      await classData.save();
    }

    const studentCount = await User.countDocuments({ classId: classData._id });
    return { classData, studentCount };
  } catch (error) {
    console.error(`Error in findOrCreateClass: ${error.message}`);
    throw new Error(error.message);
  }
};

// tạo danh sách user mới
const createListUsers = async (listData) => {
  try {
    const users = await User.insertMany(listData);
    return users;
  } catch (error) {
    console.error(`Error creating list of users: ${error.message}`);
    throw new Error(error.message);
  }
};

// Tìm người dùng theo email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(`Lỗi khi tìm kiếm người dùng theo email: ${email}`, error);
    throw error;
  }
};
export default {
  findTeacherByUsername,
  findOrCreateClass,
  createListUsers,
  findUserByEmail,
};
