const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    maxlength: 50,
  },

  lname: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    unique: true,
  },

  username: {
    type: String,
    unique: true,
  },

  phonenumber: {
    type: Number,
    maxlength: 10,
    unique: true,
  },
  aadharno: {
    type: String,
  },

  salt: {
    type: String,
    default: "string",
  },

  password: {
    type: String,
    required: true,
    maxlength: 20,
  },

  role: {
    type: String,
    enum: ["superadmin", "guard", "subadmin"],
  },

  
  isActive: {
    type: Boolean,
    default: true,
  },

  doorno: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: Number },
  address: { type: String },

  sname: {
    type: String,
  },

  sezlocation: {
    type: String,
  },

  created_on: {
    type: Number,
    default: Date.now(),
  },
});

UserSchema.plugin(AutoIncrement, { inc_field: "uid" });

UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

// hash the password using our new salt
bcrypt.hash(user.password, salt, function (err, hash) {
  if (err) return next(err);

  // override the cleartext password with the hashed one
  user.password = hash;

  next();
});
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
var User = mongoose.model("User", UserSchema);

module.exports = User