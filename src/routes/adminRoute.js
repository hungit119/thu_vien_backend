const express = require("express");
const Router = express.Router();
const adminController = require("../controllers/AdminController");
const Bearer = require("../utils/Bearer");
const { CheckPermisionAdmin } = require("../utils/CheckPermision");
const AdminController = require("../controllers/AdminController");

Router.get(
  "/getAllUser",
  Bearer,
  CheckPermisionAdmin,
  adminController.getAllUser
);
Router.get("/lockUser", Bearer, CheckPermisionAdmin, adminController.lockUser);
Router.post(
  "/createUser",
  Bearer,
  CheckPermisionAdmin,
  adminController.createNewUser
);
Router.delete(
  "/deleteUser",
  Bearer,
  CheckPermisionAdmin,
  AdminController.deleteUser
);
Router.put(
  "/updateUser",
  Bearer,
  CheckPermisionAdmin,
  AdminController.updateUserById
);
Router.get(
  "/getUserById",
  Bearer,
  CheckPermisionAdmin,
  adminController.getUserById
);
Router.get(
  "/phieumuon",
  Bearer,
  CheckPermisionAdmin,
  adminController.phieumuon
);
Router.get("/getThuThu", adminController.getThuThu);
Router.get("/getDocGia", adminController.getDocGia);

module.exports = Router;
