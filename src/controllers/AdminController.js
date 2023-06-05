const { v4 } = require("uuid");
const { con } = require("../config/db");

class AdminController {
  getAllUser(req, res) {
    const query = `select * from user where not id = '${req.userId}'`;
    con.query(query, (error, rows) => {
      if (error) res.status(400).json({ message: error });
      res.json({
        message: "get all users done",
        result: rows,
      });
    });
  }
  createNewUser(req, res) {
    const {
      username,
      password,
      role,
      status,
      fullname,
      phone,
      address,
      email,
    } = req.body;
    if (
      !username ||
      !password ||
      !role ||
      !status ||
      !fullname ||
      !phone ||
      !address ||
      !email
    ) {
      res.status(400).json({ message: "Invalid params" });
    }
    const newUser = {
      id: v4(),
      username,
      password,
      role,
      status,
      fullname,
      phone,
      address,
      email,
    };
    const query = `insert into user (id,username,password,role,status,fullname,phone,address,email) values
    ('${newUser.id}','${newUser.username}','${newUser.password}','${newUser.role}','${newUser.status}','${newUser.fullname}','${newUser.phone}','${newUser.address}','${newUser.email}')`;
    con.query(query, (error) => {
      if (error) res.status(400).json({ message: error });
      res.json({
        message: "created user done",
        result: newUser,
      });
    });
  }
  lockUser(req, res) {
    const { id } = req.query;
    const { status } = req.query;
    if (!id) {
      res.status(400).json({ message: "Invalid params" });
    }
    const query = `UPDATE user
    SET status = ${status ? status : "0"}
    WHERE id = "${id}";`;
    con.query(query, (error) => {
      if (error) res.status(400).json({ message: error });
      res.json({
        message: "lock user success",
      });
    });
  }
  deleteUser(req, res) {
    try {
      const { id } = req.query;
      const queryDeleteUserById = `DELETE FROM user where id = '${id}'`;
      con.query(queryDeleteUserById, (error) => {
        if (error) res.status(400).json({ message: error });
        res.json({
          message: "deleted user by id" + id,
        });
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  updateUserById(req, res) {
    try {
      const { id } = req.query;
      const { newUser } = req.body;
      // delete User with id
      const queryDeleteUserWithId = `DELETE FROM User where id = '${id}';`;
      con.query(queryDeleteUserWithId, (error) => {
        if (error) res.status(400).json({ message: error });
        // update new User
        const queryCreateNewUser = `INSERT INTO User (id,username,password,role,status,fullname,phone,address,email) values 
        ('${id}','${newUser.username}','${newUser.password}','${newUser.role}','${newUser.status}','${newUser.fullname}','${newUser.phone}','${newUser.address}','${newUser.email}')
        `;
        con.query(queryCreateNewUser, (error) => {
          if (error) res.status(400).json({ message: error });
          // get created new User
          const queryGetUserById = `SELECT * from User where id = '${id}';`;
          con.query(queryGetUserById, (error, rows) => {
            if (error) res.status(400).json({ message: error });
            res.json({
              message: "updated User with id " + id,
              result: rows[0],
            });
          });
        });
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  getUserById(req, res) {
    try {
      const { id } = req.query;
      const queryGetUser = `SELECT * from user where id = '${id}' `;
      con.query(queryGetUser, (error, rows) => {
        if (error) res.status(400).json({ message: error });
        res.json({
          message: "get user by id done",
          result: rows[0],
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  phieumuon(req, res) {
    try {
      const query = `select user.username as docgia,t.username as thuthu, t.id, book.title, chitietphieumuon.dateStart, chitietphieumuon.dueDate from (select user.username, phieumuon.docgiaId,phieumuon.id from phieumuon inner join user on phieumuon.thuthuId = user.id) as t inner join user on t.docgiaId = user.id inner join chitietphieumuon on t.id = chitietphieumuon.idphieumuon inner join book on book.id = chitietphieumuon.bookId`;
      con.query(query, (error, rows) => {
        if (error) res.json({ message: error.message });
        res.json({
          success: true,
          message: "phieu muon",
          result: rows,
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  getThuThu(req, res) {
    try {
      const query = `select * from user where role = 1`;
      con.query(query, (error, rows) => {
        if (error) res.json({ message: error.message });
        res.json({
          success: true,
          message: "thu thu",
          result: rows,
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  getDocGia(req, res) {
    try {
      const query = `select * from user where role = 0`;
      con.query(query, (error, rows) => {
        if (error) res.json({ message: error.message });
        res.json({
          success: true,
          message: "docgia",
          result: rows,
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
module.exports = new AdminController();
