const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const blogRouter = require("./routes/blogPostRoutes");
const userRouter = require("./routes/userRoute");

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.static("build"));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toUTCString();
  //   console.log(req.headers);
  next();
});

app.use(`/api/v1/blogs`, blogRouter);
app.use(`/api/v1/users`, userRouter);

module.exports = app;
