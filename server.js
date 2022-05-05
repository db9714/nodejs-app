const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const { API_PORT } = process.env;
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

require("dotenv").config();
require("./config/database").connect();


// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

  
// Routes
const authRoute = require("./routes/authRoute");

app.use("/", authRoute);


// const connection = mongoose.connection;
// connection.once("open", () => console.log("MongoDB connection has been established!"));

// mongoose.connection.on("connected", () => {
//   console.log("conneted to mongo yeahh");
// });
// mongoose.connection.on("error", (err) => {
//   console.log("err connecting", err);
// });



// //Load the npm build package of the frontend CRA
// if (process.env.NODE_ENV === "production") {
//     // set a static folder
//     app.use(express.static("client/build"));
  
//     // Provide a wildcard as a fallback for all routes
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     });
//   }
  
  //Host app at PORT
  app.listen(port, () => console.log(`Server is running at PORT ${port}!`));