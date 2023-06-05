const authRoute = require("./authRoute");
const bookRoute = require("./bookRoute");
const adminRoute = require('./adminRoute')
const router = (app) => {
  app.use("/auth", authRoute);
  app.use("/book", bookRoute);
  app.use("/admin",adminRoute);
};
module.exports = router;
