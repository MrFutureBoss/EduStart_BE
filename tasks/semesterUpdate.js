import cron from "node-cron";
import moment from "moment-timezone";
import Semester from "../models/semesterModel.js";
import User from "../models/userModel.js";

// Hàm để kiểm tra và cập nhật trạng thái kỳ học
const updateSemesterStatus = async (semester) => {
  const currentDate = moment().tz("Asia/Ho_Chi_Minh");
  const startDate = moment(semester.startDate).tz("Asia/Ho_Chi_Minh");
  const endDate = moment(semester.endDate).tz("Asia/Ho_Chi_Minh");

  if (currentDate.isBefore(startDate)) {
    semester.status = "Upcoming";
  } else if (currentDate.isBetween(startDate, endDate, null, "[]")) {
    semester.status = "Ongoing";
  } else if (currentDate.isAfter(endDate)) {
    semester.status = "Finished";
  }

  await semester.save();
};

// Hàm để cập nhật trạng thái học sinh theo trạng thái kỳ học
const updateUserStatusBySemester = async () => {
  try {
    const semesters = await Semester.find();

    for (const semester of semesters) {
      const users = await User.find({ semesterId: semester._id });

      for (const user of users) {
        const currentDate = moment().tz("Asia/Ho_Chi_Minh");
        const startDate = moment(semester.startDate).tz("Asia/Ho_Chi_Minh");
        const endDate = moment(semester.endDate).tz("Asia/Ho_Chi_Minh");

        if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
          user.status = "InActive";
        } else if (currentDate.isBetween(startDate, endDate, null, "[]")) {
          user.status = "Active";
        }

        await user.save();
      }
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái học sinh:", error);
  }
};

cron.schedule("0 0 * * *", async () => {
  const semesters = await Semester.find();

  for (const semester of semesters) {
    await updateSemesterStatus(semester);
    await updateUserStatusBySemester();
  }

  console.log("Đã cập nhật trạng thái kỳ học và học sinh.");
});

// Hàm tự động tạo kỳ học mới trước 15 ngày
const createNextSemester = async () => {
  const currentDate = moment().tz("Asia/Ho_Chi_Minh");
  const currentYear = currentDate.year();

  const semesters = [
    {
      namePrefix: "SP",
      startDate: moment(`${currentYear}-01-01`, "YYYY-MM-DD").tz(
        "Asia/Ho_Chi_Minh"
      ),
      endDate: moment(`${currentYear}-04-30`, "YYYY-MM-DD").tz(
        "Asia/Ho_Chi_Minh"
      ),
    },
    {
      namePrefix: "SU",
      startDate: moment(`${currentYear}-05-01`, "YYYY-MM-DD").tz(
        "Asia/Ho_Chi_Minh"
      ),
      endDate: moment(`${currentYear}-08-31`, "YYYY-MM-DD").tz(
        "Asia/Ho_Chi_Minh"
      ),
    },
    {
      namePrefix: "FA",
      startDate: moment(`${currentYear}-09-01`, "YYYY-MM-DD").tz(
        "Asia/Ho_Chi_Minh"
      ),
      endDate: moment(`${currentYear}-12-31`, "YYYY-MM-DD").tz(
        "Asia/Ho_Chi_Minh"
      ),
    },
  ];

  for (const semester of semesters) {
    if (
      currentDate.isSameOrAfter(
        semester.startDate.clone().subtract(15, "days")
      ) &&
      currentDate.isBefore(semester.startDate)
    ) {
      const semesterName = `${semester.namePrefix}${currentYear
        .toString()
        .slice(-2)}`;

      const existingSemester = await Semester.findOne({ name: semesterName });
      if (!existingSemester) {
        const newSemester = new Semester({
          name: semesterName,
          startDate: semester.startDate.toDate(),
          endDate: semester.endDate.toDate(),
        });

        await newSemester.save();
        console.log(`Đã tạo kỳ học mới: ${semesterName}`);
      } else {
        console.log(`Kỳ học ${semesterName} đã tồn tại.`);
      }
    }
  }
};

cron.schedule("0 0 * * *", async () => {
  await createNextSemester();
  console.log("Đã kiểm tra và tạo kỳ học mới nếu cần.");
});
