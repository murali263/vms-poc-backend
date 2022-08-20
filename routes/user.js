const express = require("express");
const router = express.Router();
var User = require("../model/user");
var jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/gettinguser", async (req, res, next) => {
  try {
    const data = await User.find({ role: req.body.role });
    res.status(200).json({ sucess: true, result: data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ sucess: false });
  }
});

/* ---------Post------------*/
router.post("/create-users", async (req, res) => {
  try {
    const data = new User(req.body);
    const result = await data.save();
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});
//----------------------get total users -------------------------------//
router.get("/totalusers", async (req, res) => {
  try {
    let users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
  }
});
//------------------login------------//

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
        }
        if (isMatch) {
          res.send({
            status: 200,
            message: "logged in",
            success: true,
            user: user,
            
            token: jwt.sign(
              { role: user.role, username: user.username },
              process.env.AUTH_KEY,
              { expiresIn: "8h" }
            ),
          });
        } else {
          res.send({  success: false, message: "Invalid Password" });

        }
      });
    } else if (!user) {

      res.send({ message: "Invalid Username / Invalid Credential" });
    }
  } catch (e) {
    res.send({ msg: e.msg });
  }
});

	


router.get("/getUsers", async (req, res) => {
  try {
    userslistObj = await User.find({});
    usersList = [];

    for (let roleusers of userslistObj) {
      if (roleusers["role"] == req.query.role) {
        usersList.push(roleusers);
        
      }
}

res.status(200).json({ res: usersList , success: true});
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
