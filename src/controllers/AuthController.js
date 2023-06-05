const { con } = require("../config/db");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_TOKEN_KEY } = require("../const");

class AuthController {
  index(req, res) {
    res.json({
      message: "Hello java",
    });
  }
  // [GET] /auth/
  auth(req, res) {
    const { userId } = req;
    const query = `select * from user where id = '${userId}'`;
    con.query(query, function (error, result) {
      if (error) throw error;
      res.json({
        success: true,
        message: "load user successfully",
        userInfo: {
          ...result[0],
          password: "00000000",
        },
      });
    });
  }
  login(req, res) {
    try {
      const { username, password } = req.body;
      const query = `SELECT * from user where username = '${username}';`;
      con.query(query, async (error, rows) => {
        if (error) res.status(400).json({ message: error });
        if (rows.length === 0) {
          res.status(400).json({ message: "username incredential!" });
        }
        const user = rows[0];
        // check lock
        if (user.status === 0) {
          res.status(400).json({
            message: "Account locked",
          });
        }
        // check password
        const checkpassword = user.password === password;
        if (!checkpassword) {
          res.status(400).json({
            message: "password not true",
          });
        }
        const accessToken = jwt.sign(
          { userId: user.id, role: user.role },
          SECRET_TOKEN_KEY
        );
        res.json({
          message: "login successfully",
          result: {
            user,
            accessToken,
          },
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      // check username and email exist
      const queryGetUser = `SELECT * FROM user WHERE username = '${username}' or email = '${email}';`;
      con.query(queryGetUser, (error, rows) => {
        if (error) res.status(400).json({ message: error });
        if (rows.length !== 0) {
          res.status(400).json({ message: "username existed!" });
        }
      });
      // create new user
      const newUser = {
        id: v4(),
        username,
        email,
        password,
        role: 0, // docgia,
        // role: 1, // thuthu,
        // role: 2, // admin,
        status: 1, // active,
      };
      const accessToken = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        SECRET_TOKEN_KEY
      );
      const queryInsertUser = `INSERT INTO user (id,username,password,role,status,email) values ('${newUser.id}','${newUser.username}','${newUser.password}','${newUser.role}','${newUser.status}','${newUser.email}')`;
      con.query(queryInsertUser, (error) => {
        if (error) res.status(400).json({ message: error });
        res.json({
          message: "register successfully !",
          result: {
            newUser,
            accessToken,
          },
        });
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
module.exports = new AuthController();
