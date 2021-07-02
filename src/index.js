const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is up on port " + port);
});

// const add = (a, b) => {
//   return new Promise((resolve, response) => {
//     response(a + b);
//   });
// };
// console.log(add(2, 5));
