import professionRouters from "./professionRoutes.js";
import specialtyRouters from "./specialtyRoutes.js";
import userRouters from "./userRoutes.js";
import adminRouter from "./adminRouter.js";
import semesterRouter from "./semesterRouter.js";
import tempMatchingRouter from "./tempMatching.js";
import teacherRouter from "./teacherRouter.js";

const routes = {
  professionRouters,
  specialtyRouters,
  adminRouter,
  semesterRouter,
  tempMatchingRouter,
  teacherRouter,
  userRouters,
};

export default routes;
