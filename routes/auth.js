const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");
const JWT_SECRET = "secret@#string";
var fetchUser = require("../middleware/fetchUser");

//Route 1 : Create a user using:POST "/api/auth/createuser" No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email ").isEmail(),
    body("password", "Password must be at leasat 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    //If there is any error it will return error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //.findone() checks whether the user with particular email is already in database or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Email address already exists" });
      }
      //To add salt in the password string
      const salt = await bcrypt.genSalt(10);
      const secPasswd = await bcrypt.hash(req.body.password, salt);
      //To create new user
      user = await User.create({
        name: req.body.name,
        password: secPasswd,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
      //res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error occutrd");
    }
  }
);

//Route2 : Authenticate a user using:POST "/api/auth/login" No login required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email ").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    //If there is any error it will return error
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Destructuring
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Enter valid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Enter valid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
);

//Route3 : Logged in user Details :POST "/api/auth/getuser" login required
//fetchUser middleware run before async (req,res)
router.post("/getuser", fetchUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

//Route4 :Updating User : PUT "api/auth/updateuser" login required

router.put("/updateuser/:id", fetchUser, async (req, res) => {
  updateuser(req, res);
});

function updateuser(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.json({ doc });
      } else {
        console.log("Error during record update : " + err);
      }
    }
  );
}
module.exports = router;
