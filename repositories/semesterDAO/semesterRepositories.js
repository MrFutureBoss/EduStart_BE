import Semester from "../../models/semesterModel.js";

const findUpcomingSemesters = async () => {
  try {
    const semesters = await Semester.find({ status: "Upcoming" });
    return semesters;
  } catch (error) {
    console.error("Lỗi khi tìm các kỳ học 'Upcoming':", error);
    throw error;
  }
};

export default {
  findUpcomingSemesters,
};
