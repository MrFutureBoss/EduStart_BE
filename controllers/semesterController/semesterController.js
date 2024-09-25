import semesterDAO from "../../repositories/semesterDAO/index.js";

const getUpcomingSemesters = async (req, res, next) => {
  try {
    const upcomingSemesters = await semesterDAO.findUpcomingSemesters();

    if (!upcomingSemesters || upcomingSemesters.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có kỳ học 'Upcoming' nào." });
    }

    res.status(200).json(upcomingSemesters);
  } catch (error) {
    console.error("Lỗi khi lấy các kỳ học 'Upcoming':", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export default {
  getUpcomingSemesters,
};
