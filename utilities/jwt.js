import jwt from "jsonwebtoken";
import createError from "http-errors";

function signAccessToken(userId, role) {
  return new Promise((resolve, reject) => {
    const payload = { role };

    const secret = process.env.SECRETKEY;
    const options = {
      expiresIn: "12h",
      issuer: "localhost:9999",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(createError.Unauthorized());

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRETKEY, (err, payload) => {
    if (err) return next(createError.Unauthorized());
    req.payload = payload;
    next();
  });
}
function verifyRole(allowedRoles) {
  return (req, res, next) => {
    const { role } = req.payload;

    if (!allowedRoles.includes(role)) {
      return next(
        createError.Forbidden("Bạn không có quyền truy cập vào tài nguyên này")
      );
    }

    next();
  };
}

export { signAccessToken, verifyAccessToken, verifyRole };
