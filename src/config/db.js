const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tranduyhung11",
  database: "thuvien",
  multipleStatements: true,
});
function connect() {
  con.connect((err) => {
    if (err) throw err;
    console.log("connected to mysql server !");
  });
}
module.exports = { connect, con };
