const db = require("./db/database");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require("./routes/apiRoutes");
// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// use apiRoutes
app.use("/api", apiRoutes);
//-------------- default response for any other request (Not Found) catch all ---------------------//
app.use((req, res) => {
  res.status(404).end();
});
// start eh express.js server at ver end of the server.js. start it after the DB connection
db.on("open", () => {
  app.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`);
  });
});
