import express, { json } from "express";
import dotnv from "dotenv";
import cors from "cors";
import multer from "multer";
import createError from "http-errors";
import path from "path";
import connectDB from "./database.js";
import http from "http";
import adminRouter from "./routes/index.js";
import routes from "./routes/index.js";
const app = express();
dotnv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(json());

const port = process.env.PORT || 9999;
const server = http.createServer(app);
// const io = setupSocket(server);

// app.set("io", io);

// Cấu hình multer và các route
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });



// app.use("/admins", adminRouter);
app.use("/profession", routes.professionRouters);
app.use("/specialty", routes.specialtyRouters);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.status || 500,
    message: err.message,
  });
});

server.listen(port, () => {
  connectDB();
  console.log(`listening on ${port}`);
});
