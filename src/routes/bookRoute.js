const express = require("express");
const Router = express.Router();
const bookController = require("../controllers/BookController");
const Bearer = require("../utils/Bearer");
const {
  CheckPermisionManager,
  CheckPermisionAdmin,
} = require("../utils/CheckPermision");

Router.get("/", bookController.getAllBook);
Router.get("/getBookById", bookController.getBookById);
Router.post("/", Bearer, CheckPermisionAdmin, bookController.create);
Router.delete("/", Bearer, CheckPermisionAdmin, bookController.deleteBook);
Router.put("/", Bearer, CheckPermisionAdmin, bookController.updateBookById);

Router.post("/borrowBook", bookController.borrowBook);
Router.post("/borrowBooks", bookController.borrowBooks);
Router.get("/getBorrowBook", bookController.getBorrowBook);
Router.post("/returnBook", bookController.returnBook);
Router.post("/searchBookByTitle", bookController.searchBookByTitle);

module.exports = Router;
