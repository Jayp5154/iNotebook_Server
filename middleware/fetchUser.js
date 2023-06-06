const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret@#string";

// const fetchUser = (req, res, next) => {
//   //Get the user from jwt token and add id to req object
//   const token = req.header("auth-token");
//   if (!token) {
//     res.status(401).send({ error: "Please authenticate-1 using valid token" });
//   }

//   try {
//     const data = jwt.verify(token, JWT_SECRET);
//     req.user = data.user;
//     next(); //next() functi on is used to run next async functioni.e.router.post("/getuser", fetchUser, async (req, res) =>
//   } catch (error) {
//     res.status(401).send({ error: "Please authenticate using valid token" });
//   }

//   next(); //next() functi on is used to run next async functioni.e.router.post("/getuser", fetchUser, async (req, res) =>
// };

const fetchUser = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "Please authenticate-1 using valid token" });
  }

  jwt.verify(token, JWT_SECRET, function (err, decodedToken) {
    if (err) {
      res
        .status(401)
        .send({ error: "Please authenticate-1 using valid token" });
    } else {
      req.user = decodedToken.user; // Add to req object
      next();
    }
  });
};

module.exports = fetchUser;
