const mongoose = require("mongoose");
const { MONGOURI } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
    //   console.error(error);
    //   process.exit(1);
    });
};