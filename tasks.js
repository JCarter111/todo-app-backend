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

  // get tasks from database
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

// post task to database
app.post("/tasks", function (request, response) {
  const taskToBeSaved = request.body;
  console.log(taskToBeSaved);
  const insertQuery = "INSERT INTO Tasks (description, dueDate, priority, completed, userId) VALUES (?, ?, ?, ?, ?)";
  connection.query(insertQuery, [taskToBeSaved.description, taskToBeSaved.dueDate, taskToBeSaved.priority, taskToBeSaved.completed,taskToBeSaved.userId], function (error, results, fields) {
    if (error) {
      console.log("Error saving new task", error);
      response.status(500).json({
        error: error
      });
    } else {
      response.json({
        taskId: results.insertId
      });
    }
  });
});

// delete task from database
// example of using a parameter for data update
app.delete("/tasks/:taskId", function(request, response) {
  const query =
    "DELETE FROM Tasks WHERE taskId = " + connection.escape(request.params.taskId);
  connection.query(query, (err, deleteResults) => {
    if (err) {
      console.log("Error deleting Task", err);
      response.status(500).json({
        error: err
      });
      console.log(query);
    } else {
      response.status(200).send("Task deleted");
    }
  });
});

// update a task in the database - example of using a parameter
// for data update
app.put("/tasks/:taskId", function(request, response) {
  const task = request.body.task;
  const id = request.params.taskId;
  // may need to change query here
  const query =
    "UPDATE Tasks SET completed = true WHERE taskId = " + connection.escape(request.params.taskId);
    //"UPDATE Task SET Description = ?, Completed = ?, UserId = ? WHERE TaskId = ?";
  connection.query(
    query,
    [id],
    // [task.Description, task.Completed, task.UserId, id],
    function(err, queryResponse) {
      if (err) {
        console.log("Error updating task", err);
        response.status(500).send({ error: err });
        console.log(query);
      } else {
        response.status(201).send("Updated");
      }
    }
  );
});
module.exports.handler = serverless(app);