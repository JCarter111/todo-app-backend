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

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Tasks"
});

  app.get("/tasks", function(request, response) {
  //  const username = request.query.username;
    let query = "SELECT * FROM Tasks";
   // if (username) {
   //   query =
   //     "SELECT * FROM Tasks JOIN User on Tasks.UserId = User.UserId WHERE User.Username = " +
   //     connection.escape(username);
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

  
  //const someJson = {
  //  message: "Hello " + username + ", how are you?"
  // };
  
  // create task list
  //const tasksJson = {
      // optional - message for user
  //    message: "Hello " + username + ", these are your tasks",
      // task list array
  //    todoListItems: [
  //    {todoItem: "Buy cough sweets", 
  //      date: moment("2019-11-19").format("DD-MM-YYYY"), 
  //      completed: false, priority: false, id:uuidv4()},
  //    {todoItem: "Do the washing",
  //      date: moment("2019-05-12").format("DD-MM-YYYY"),
  //      completed: false, priority: true, id:uuidv4()},
  //    {todoItem: "Online Shopping Order", 
  //      date: moment("2019-03-12").format("DD-MM-YYYY"), 
  //      completed: true, priority: false, id:uuidv4()},
  //    {todoItem: "Buy Birthday present", 
  //      date: moment("2019-05-13").format("DD-MM-YYYY"),
  //      completed: false, priority: false, id:uuidv4()},
  //  ] 
  //};
  
  // display task list
//  response.json(tasksJson);
//})

module.exports.handler = serverless(app);