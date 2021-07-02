const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");
let upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete("/user/me/avatar", auth, async (req, res) => {
  user = await User.findById(req.user._id);
  user.avatar = undefined;
  await user.save();
  res.status(200).send();
});
router.get("/user/me/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send();
  }
});
router.post("/user", async (req, res) => {
  const use = new User(req.body);
  try {
    await use.save();
    const token = await use.generateAuthToken();
    res.status(201).send({ user: await use.getPublicProfile(), token });
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // const userInfo = await user.getPublicProfile();
    res.send({ user: await user.getPublicProfile(), token });
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/user/me", auth, async (req, res) => {
  res.send(await req.user.getPublicProfile());
});
router.post("/user/logout", auth, async (req, res) => {
  try {
    const loggout = req.user.tokens.filter((i) => {
      return i.token !== req.token;
    });
    req.user.tokens = loggout;
    await req.user.save();
    res.send("loggout");
  } catch (error) {
    res.status(500).send();
  }
});
router.post("/user/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(await req.user.getPublicProfile());
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    user = req.user;
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send(await user.getPublicProfile());
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete("/user/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    res.send(await req.user.getPublicProfile());
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
