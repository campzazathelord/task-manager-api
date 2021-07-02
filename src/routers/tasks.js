const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();
router.get("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/task", auth, async (req, res) => {
  try {
    const taskObject = {
      owner: req.user._id,
      completed: req.query.completed === "true",
    };
    if (!req.query.completed) {
      delete taskObject.completed;
    }
    const tasks = await Task.find(taskObject, undefined, {
      limit: Number(req.query.limit),
      skip: Number(req.query.skip),
    });
    res.send(tasks);
  } catch (error) {
    res.status(400);
  }
});
router.post("/task", auth, async (req, res) => {
  // const newTask = new Task(req.body);
  const newTask = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400);
  }
});
router.patch("/task/:id", auth, async (req, res) => {
  if (req.params.id.length != 24) {
    return res.status(400).send("invalid id");
  }
  const keys = Object.keys(req.body); //["description","completed"]
  const tasks = await Task.findOne({
    owner: req.params.id,
    _id: req.params.id,
  });
  if (!tasks) {
    return res.status(404).send("not found");
  }
  try {
    keys.forEach((i) => {
      tasks[i] = req.body[i];
    });
    await tasks.save();
    res.send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      owner: req.params.id,
      _id: req.params.id,
    });
    res.status(200).send(deletedTask);
  } catch (error) {
    res.status(400);
  }
});
module.exports = router;
