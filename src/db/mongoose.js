const mongoose = require("mongoose");
// const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// const User = mongoose.model("tasks", {
//   name: {
//     type: String,
//   },
//   age: {
//     type: Number,
//     default: 0,
//   },
//   email: {
//     type: String,
//     required: true,
//     validate(val) {
//       if (!validator.isEmail(val)) {
//         throw new Error("Not email");
//       }
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     validate(val) {
//       if (val.includes("password")) {
//         throw new Error("must not contain the word password");
//       } else if (val.toLowerCase().length <= 6) {
//         throw new Error("length must be greater than 6");
//       }
//     },
//   },
// });
// const me = new User({
//   name: "Rapeekorn",
//   password: "Camdsadsads",
//   email: "campzazathelord@gmai.com",
// });

// const camp1 = new User({
//   name: "Camp1",
//   email: "campzazathelord@gmail.com",
//   age: 21,
//   password: "camp321321",
// });

// camp1
//   .save()
//   .then(() => {
//     console.log(camp1);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
// const me = new User({
//   name: "Camp",
//   age: 21,
//   email: "campzazathelord@me.com",
// });
// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
