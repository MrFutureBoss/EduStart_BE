import Group from "../../models/groupModel.js";

const getAllGroupsByTeacherId = async (teacherId) => {
  try {
    const groups = await Group.find()
      .populate({
        path: "classId",
        match: { teacherId: teacherId },
      })
      .populate("projectId");

    const filteredGroups = groups.filter((group) => group.classId !== null);

    if (!filteredGroups || filteredGroups.length === 0) {
      throw new Error("Không có nhóm nào cho giáo viên này.");
    }

    return filteredGroups;
  } catch (error) {
    console.error("Error in getAllGroupsByTeacherId:", error);
    throw new Error(error.message);
  }
};

export default {
  getAllGroupsByTeacherId,
};
