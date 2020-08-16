const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// default response for any other request (Not Found) catch all
app.use((req, res) => {
  res.status(404).end();
});

// start eh express.js server at ver end of the server.js
app.listen(PORT, () => {
  console.log(`server runing on port ${PORT}`);
});
