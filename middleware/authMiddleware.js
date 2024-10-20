const jwt = require("jsonwebtoken");
const db = require("../config/dbConfig");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if web token exists & is valid
  if (token) {
    jwt.verify(token, "example secret key", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if web token exists & is valid
  if (token) {
    jwt.verify(token, "example secret key", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);

        const query = "SELECT id, email FROM users WHERE id = ?";
        db.query(query, [decodedToken.id], (err, result) => {
          if (err) {
            console.log(err);
            res.locals.user = null;
            next();
          } else if (result.length === 0) {
            res.locals.user = null;
            next();
          } else {
            res.locals.user = { id: result[0].id, email: result[0].email };
            next();
          }
        });
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
