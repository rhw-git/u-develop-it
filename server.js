const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const inputCheck = require("./utils/inputCheck");
const PORT = process.env.PORT || 3001;
const app = express();
// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// connect o database
const db = new sqlite3.Database("./db/election.db", (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("connected to the election database.");
});
// request all elements in the database
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT candidates.*, parties.name
               AS party_name
               FROM candidates
               LEFT JOIN parties
               ON candidates.party_id = parties.id`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
//---------------- request a single candidate ---------------------//
app.get("/api/candidate/:id", (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
               AS party_name
               FROM candidates
               LEFT JOIN parties
               ON candidates.party_id = parties.id
               WHERE candidates.id =?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});
//--------------- request to delete a candidate -------------------//
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id =?`;
  const params = [req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
    }
    res.json({
      message: "successfully deleted",
      data: this.changes,
    });
  });
});
// ------------- create a candidate -------------------------//
app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  // ESS function, not arrow function, to use `this`
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
      id: this.lastID,
    });
  });
});
// ------------------------ api for all parties -------------------------//
app.get("/api/parties", (req, res) => {
  const sql = `SELECT * FROM parties`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
// ------------------------ api for one party by id -------------------------//
app.get("/api/party/:id", (req, res) => {
  const sql = `SELECT * FROM parties WHERE id =?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});
// ------------------------ api for delete one party -------------------------//
app.delete("/api/party/:id", (req, res) => {
  const sql = `DELETE FROM parties WHERE id =?`;
  const params = [req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({ message: "successfully deleted", changes: this.changes });
  });
});
// ------------------------ api update party affiliation -------------------------//
app.put("/api/candidate/:id", (req, res) => {
  const errors = inputCheck(req.body, "party_id");
  if (errors) {
    res.status(400).json({ error: errors });
  }
  const sql = `UPDATE candidates SET party_id = ?
               WHERE id =?`;
  const params = [req.body.party_id, req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: req.body,
      changes: this.changes,
    });
  });
});
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
