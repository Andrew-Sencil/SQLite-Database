import { DB } from "./connect.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("Mortal enemy service is online");
});

app.get("/api", (req, res) => {
  res.set("conent-type", "applicaiton/json");
  const sql = "SELECT * from enemies";
  let data = { enemies: [] };

  try {
    //This retrieves only single row
    // DB.get();
    //This retrieve all inside the table
    DB.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }

      rows.forEach((row) => {
        data.enemies.push({
          id: row.enemy_id,
          name: row.enemy_name,
          reason: row.enemy_reason,
        });
      });

      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log(err.message);
    res.status(467);
    res.send(`{"code": 467, "status": "${err.message}"}`);
  }
});

app.post("/api", (req, res) => {
  res.set("conent-type", "applicaiton/json");
  const sql = "INSERT INTO enemies(enemy_name, enemy_reason) values(?, ?)";
  let newID;

  try {
    DB.run(sql, [req.body.name, req.body.reason], function (err) {
      if (err) throw err;

      newID = this.lastID; //Provides the auto increment integer enemy_id

      res.status(201);
      let data = { status: 201, message: `Mortal enemy ${newID} saved.` };
      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log(err.message);
    res.status(468);
    res.send(`{"code": 468, "status": "${err.message}"}`);
  }
});
app.delete("/api", (req, res) => {
  res.set("conent-type", "applicaiton/json");
  const sql = "DELETE FROM enemies WHERE enemy_id = ?";
  try {
    DB.run(sql, [req.query.id], function (err) {
      if (err) throw err;

      if (this.changes === 1) {
        res.status(200);
        res.send(`{"message": "Enemy ${req.query.id} was removed from list."}`);
      } else {
        res.status(200);
        res.send(`{"message": "No operation needed."}`);
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(469);
    res.send(`{"code": 468, "status": "${err.message}"}`);
  }
});

app.listen(3000, (err) => {
  if (err) {
    console.log("ERROR:", err.message);
  }

  console.log("Listening on port 3000");
});
