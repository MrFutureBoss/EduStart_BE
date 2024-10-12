import Class from "../../models/classModel.js";
import MentorCategory from "../../models/mentorCategoryModel.js";
import Semester from "../../models/semesterModel.js";
import User from "../../models/userModel.js";

const createSemester = async (semesterData) => {
  const semester = new Semester(semesterData);
  return await semester.save();
};

const getAllSemesters = async () => {
  return await Semester.find({});
};

const getOverlappingSemester = async (startDate, endDate) => {
  return await Semester.find({
    $or: [
      { startDate: { $lte: endDate, $gte: startDate } },
      { endDate: { $lte: endDate, $gte: startDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
    ],
  });
};

const getSemesterByName = async (name) => {
  return await Semester.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
};

const updateSemesterStatus = async (semesterId, status) => {
  return await Semester.findByIdAndUpdate(
    semesterId,
    { status },
    { new: true }
  );
};

const updateUserStatusBySemesterId = async (semesterId, status) => {
  return await User.updateMany({ semesterId }, { status });
};

const updateSemester = async (semesterId, updateData) => {
  return await Semester.findByIdAndUpdate(semesterId, updateData, {
    new: true,
  });
};

const getUsersBySemesterId = async (semesterId) => {
  try {
    const users = await User.find({ semesterId })
      .populate({
        path: "classId",
        select: "className",
      })
      .lean();

    const mentorIds = users
      .filter((user) => user.role === 3)
      .map((user) => user._id);

    const mentorCategories = await MentorCategory.find({
      mentorId: { $in: mentorIds },
    })
      .populate({
        path: "specialties.specialtyId",
        model: "Specialty",
        select: "name",
      })
      .populate({
        path: "professionId",
        model: "Profession",
        select: "name",
      });

    const teacherIds = users
      .filter((user) => user.role === 2)
      .map((user) => user._id);

    const teacherClasses = await Class.find({ teacherId: { $in: teacherIds } });

    const usersWithAdditionalInfo = users.map((user) => {
      if (user.role === 3) {
        const mentorCategory = mentorCategories.find((mc) =>
          mc.mentorId.equals(user._id)
        );
        if (mentorCategory) {
          user.mentorCategoryInfo = {
            profession: mentorCategory.professionId?.name || "N/A",
            specialties: mentorCategory.specialties
              .map((spec) => spec.specialtyId?.name || "Unknown Specialty")
              .join(", "),
          };
        } else {
          user.mentorCategoryInfo = {};
        }
      } else if (user.role === 2) {
        user.classesTeaching = Array.isArray(teacherClasses)
          ? teacherClasses
              .filter((cls) => cls.teacherId.equals(user._id))
              .map((cls) => ({
                classId: cls._id,
                className: cls.className || cls.name || "Unknown Class Name",
              }))
          : [];
      }
      return user;
    });

    return usersWithAdditionalInfo;
  } catch (error) {
    console.error("Error in getUsersBySemesterId:", error);
    throw new Error("Lỗi khi lấy danh sách người dùng theo kỳ học.");
  }
};

export default {
  createSemester,
  getAllSemesters,
  getOverlappingSemester,
  updateSemesterStatus,
  updateUserStatusBySemesterId,
  getSemesterByName,
  updateSemester,
  getUsersBySemesterId,
};
