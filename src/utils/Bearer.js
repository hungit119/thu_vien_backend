const jwt = require("jsonwebtoken");
const { SECRET_TOKEN_KEY } = require("../const");
const Bearer = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "invalid token",
      });
    }
    const decoded = jwt.verify(token, SECRET_TOKEN_KEY);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      message: "server error verify token",
    });
  }
};
module.exports = Bearer;
