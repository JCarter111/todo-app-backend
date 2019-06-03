const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
// add mysql to access db and run queries
const mysql = require('mysql');

// add uuidv4 to assign unique ids to task
const uuidv4 = require('uuid/v4');
// added moment to format dates in task list
const moment = require('moment');
app.use(cors());

// instruction to express to translate the request
// body into JSON
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Tasks"
});

  app.get("/tasks", function(request, response) {
  //  const username = request.query.username;
  //  optional - message for user
  //  message: "Hello " + username + ", these are your tasks",
    let query = "SELECT * FROM Tasks";

  // username in SQL query
  // if (username) {
  // query =
  // "SELECT * FROM Tasks JOIN User on Tasks.UserId = User.UserId WHERE User.Username = " +
  // connection.escape(username);
  // }
    connection.query(query, (err, queryResults) => {
      if (err) {
        console.log("Error fetching tasks", err);
        response.status(500).json({
          error: err
        });
      } else {
        response.json({
          tasks: queryResults
        });
      }
    });
  });
  app.post("/tasks", function(request, response) {
    const taskToBeSaved = request.body;
    console.log(taskToBeSaved);
  });
module.exports.handler = serverless(app);