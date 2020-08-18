const sqlite3 = require("sqlite3").verbose();
// connect o database
const db = new sqlite3.Database("./db/election.db", (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("connected to the election database.");
});

module.exports = db;
