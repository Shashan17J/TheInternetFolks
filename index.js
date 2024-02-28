const express = require("express");
const app = express();

const roleRoutes = require("./routes/Role");
const userRoutes = require("./routes/User");
const communityRoutes = require("./routes/Community");
const memberRoutes = require("./routes/Member");

const database = require("./config/database");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());

app.use("/v1", roleRoutes);
app.use("/v1/auth", userRoutes);
app.use("/v1", communityRoutes);
app.use("/v1", memberRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is up and running",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
