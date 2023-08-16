const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app.js");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => console.log("DB connection established"));

const port = process.env.PORT;
console.log(app.get("env"));
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
