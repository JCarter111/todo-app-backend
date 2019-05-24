const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
// add uuidv4 to assign unique ids to task
const uuidv4 = require('uuid/v4');
// added moment to format dates in task list
const moment = require('moment');
app.use(cors());

app.get('/tasks', function (request, response) {

  const username = request.query.username;

  //const someJson = {
  //  message: "Hello " + username + ", how are you?"
  // };
  
  // create task list
  const tasksJson = {
      // optional - message for user
      message: "Hello " + username + ", these are your tasks",
      // task list array
      todoListItems: [
      {todoItem: "Buy cough sweets", 
        date: moment("2019-11-19").format("DD-MM-YYYY"), 
        completed: false, priority: false, id:uuidv4()},
      {todoItem: "Do the washing",
        date: moment("2019-05-12").format("DD-MM-YYYY"),
        completed: false, priority: true, id:uuidv4()},
      {todoItem: "Online Shopping Order", 
        date: moment("2019-03-12").format("DD-MM-YYYY"), 
        completed: true, priority: false, id:uuidv4()},
      {todoItem: "Buy Birthday present", 
        date: moment("2019-05-13").format("DD-MM-YYYY"),
        completed: false, priority: false, id:uuidv4()},
    ] 
  };
  
  // display task list
  response.json(tasksJson);
})

module.exports.handler = serverless(app);