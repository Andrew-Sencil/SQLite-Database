import sqlite3 from "sqlite3";
const sql3 = sqlite3.verbose();

//Creates temporary file that is saved in the memory, once the pc is turned off, it automatically erases the db
// const DB = new sql3.Database(":memory:", sqlite3.OPEN_READWRITE, connected);
//This creates a temporary file most likely, when it shuts down, it will be deleted
// const DB = new sql3.Database("", sqlite3.OPEN_READWRITE, connected);
const DB = new sql3.Database("./mydata.db", sqlite3.OPEN_READWRITE, connected);

function connected(err) {
  if (err) {
    console.log(err.message);
    return;
  }

  console.log("Database Created or SQLite DB does already exist");
}

let sql = `CREATE TABLE IF NOT EXISTS enemies(
    enemy_id INTEGER PRIMARY KEY,
    enemy_name TEXT NOT NULL,
    enemy_reason TEXT NOT NULL
)`;

//call backfunction
DB.run(sql, [], (err) => {
  if (err) {
    console.log("error creating enemies table");
    return;
  }
  console.log("Table created");
});

export { DB };
