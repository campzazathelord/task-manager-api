const mongoose = require("mongoose");
const validator = require("validator");
require("../db/mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
//201.81

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Not email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(val) {
        if (val.includes("password")) {
          throw new Error("must not contain the word password");
        } else if (val.toLowerCase().length <= 6) {
          throw new Error("length must be greater than 6");
        }
      },
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
//virtual property = relationship between user and task
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});
//methods ใช้กับ ตัวแปลทำดา

userSchema.methods.getPublicProfile = async function () {
  const user1 = this.toObject();
  delete user1.tokens;
  delete user1.password;
  return user1;
};
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: String(this._id) }, "thisismynewcourse"); //this._id เป็น object ต้องแปลงเป็น string
  this.tokens.push({ token });
  user.save();
  return token;
};
//static ใช้กับ model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to Login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const userObject = this; //this = document object that is being saved
  if (this.isModified("password")) {
    //isModified will be true when password is first created or patched
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
