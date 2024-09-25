import adminsDAO from "../../repositories/adminDAO/index.js";
import bcrypt from "bcrypt";
import xlsx from "xlsx";
import classDAO from "../../repositories/classDAO/index.js";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const normalizeUserData = (row) => {
  const normalized = {
    email: row.Email ? row.Email.trim().toLowerCase() : "",
    rollNumber: row.RollNumber ? row.RollNumber.trim() : "",
    memberCode: row.MemberCode ? row.MemberCode.trim() : "",
    teacherUsername: row["GV chính"] ? row["GV chính"].trim() : "",
    className: row.ClassName ? row.ClassName.trim() : "",
    slotType: row.SlotType ? row.SlotType.trim() : "TS33",
    username: row.FullName ? row.FullName.trim() : "Unknown",
    role: 4,
  };

  if (!normalized.email || !validateEmail(normalized.email)) {
    throw new Error(`Email không hợp lệ: ${normalized.email}`);
  }
  if (!normalized.teacherUsername) {
    throw new Error(
      `Thiếu username giáo viên cho học sinh: ${normalized.username}`
    );
  }
  if (!normalized.className) {
    throw new Error(
      `Thiếu tên lớp (ClassName) cho học sinh: ${normalized.username}`
    );
  }

  return normalized;
};

const insertListUsers = async (req, res, next) => {
  try {
    const { semesterId } = req.body;
    if (!semesterId) {
      return res.status(400).send("Semester ID không tồn tại.");
    }

    const saltRounds = 12;
    const file = req.file;
    if (!file) {
      return res.status(400).send("File không tồn tại.");
    }

    const password = "Aa@123";
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const workbook = xlsx.read(file.buffer);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const classCache = {};
    const teacherCache = {};
    const duplicateEmails = [];
    const fullClassUsers = [];

    for (const row of data) {
      const user = normalizeUserData(row);
      // biến này để kiểm tra là tồn tại email này trong hệ thống chưa
      const existingUser = await adminsDAO.findUserByEmail(user.email);
      if (existingUser) {
        duplicateEmails.push(user.email);
        continue;
      }
      // biến này để kiểm tra giáo viên có tồn tại hay không
      if (!teacherCache[user.teacherUsername]) {
        const teacher = await adminsDAO.findTeacherByUsername(
          user.teacherUsername
        );
        if (!teacher) {
          throw new Error(
            `Giáo viên với username ${user.teacherUsername} không tồn tại.`
          );
        }
        teacherCache[user.teacherUsername] = teacher._id;
      }
      // biến này để kiểm tra có lớp trong hệ thống hay chưa
      if (!classCache[user.className]) {
        let { classData, studentCount } = await adminsDAO.findOrCreateClass(
          user.className,
          teacherCache[user.teacherUsername]
        );
        classCache[user.className] = classData._id;

        if (studentCount === 0) {
        } else {
          const studentCountInClass = await classDAO.getStudentCountByClassId(
            classData._id
          );

          if (studentCountInClass >= classData.limitStudent) {
            fullClassUsers.push(user);
            continue;
          }
        }
      } else {
        const studentCountInClass = await classDAO.getStudentCountByClassId(
          classCache[user.className]
        );
        const classData = await classDAO.getClassById(
          classCache[user.className]
        );

        if (studentCountInClass >= classData.limitStudent) {
          fullClassUsers.push(user);
          continue;
        }
      }

      const userData = {
        ...user,
        password: hashedPassword,
        classId: classCache[user.className],
        semesterId: semesterId,
      };

      await adminsDAO.createListUsers([userData]);
    }

    res.status(200).json({
      message: "All users processed successfully.",
      duplicateEmails,
      fullClassUsers,
    });
  } catch (error) {
    console.error(`Error encountered: ${error.message}`);
    next(error);
  }
};

export default {
  insertListUsers,
};
