const express = require("express");
const Router = express.Router();
const authController = require("../controllers/AuthController");
const Bearer = require("../utils/bearer");

Router.get("/",Bearer, authController.auth);
Router.post("/login", authController.login);
Router.post("/register", authController.register);

module.exports = Router;
