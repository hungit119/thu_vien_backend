const CheckPermisionManager = (req, res, next) => {
  if (req.role < 1) {
    res.status(401).json({
      message: "Not permision access",
    });
  }
  next();
};
const CheckPermisionAdmin = (req, res, next) => {
  if (req.role < 2) {
    res.status(401).json({
      message: "Not permision access",
    });
  }
  next();
};
module.exports = { CheckPermisionManager, CheckPermisionAdmin };
