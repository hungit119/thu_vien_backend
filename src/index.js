const express = require("express");
const cors = require("cors");
const router = require("./routes");
const app = express();
const PORT = 3333;

const { connect } = require("./config/db");

app.use(express.json());
app.use(cors());
router(app);
connect();

app.listen(PORT, () => {
  console.log("Node server running @ http://localhost:" + PORT);
});
