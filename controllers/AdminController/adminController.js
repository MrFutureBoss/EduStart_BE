import adminsDAO from "../../repositories/adminRepositories/index.js";
import bcrypt from "bcrypt";
import xlsx from "xlsx";

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
    const saltRounds = 12;
    const file = req.file;
    if (!file) {
      return res.status(400).send("File không tồn tại");
    }

    const password = "Aa@123";
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const workbook = xlsx.read(file.buffer);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const classCache = {};
    const teacherCache = {};

    for (const row of data) {
      const user = normalizeUserData(row);

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

      if (!classCache[user.className]) {
        let classData = await adminsDAO.findOrCreateClass(
          user.className,
          teacherCache[user.teacherUsername]
        );
        classCache[user.className] = classData._id;
      }

      const userData = {
        ...user,
        password: hashedPassword,
        classId: classCache[user.className],
      };

      await adminsDAO.createListUsers([userData]);
    }

    res.send("All users processed successfully.");
  } catch (error) {
    console.error(`Error encountered: ${error.message}`);
    next(error);
  }
};

export default {
  insertListUsers,
};
