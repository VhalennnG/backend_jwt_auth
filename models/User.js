const db = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(String(email).toLowerCase());
};

const createUser = (email, password, callback) => {
  let errors = { email: "", password: "" };

  if (!email) errors.email = "Please enter an email";
  if (!validateEmail(email)) errors.email = "Invalid email format.";
  if (!password) errors.password = "Please enter your password";
  if (password.length < 6)
    errors.password = "Password must be at least 6 characters long.";

  // Jika ada error validasi, kirim error tanpa melanjutkan eksekusi
  if (errors.email || errors.password) {
    return callback({ message: "Validation failed", errors });
  }

  const lowerCaseEmail = email.toLowerCase();

  const checkEmail = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmail, [lowerCaseEmail], (err, result) => {
    if (err) return callback(err);

    if (result.length > 0)
      return callback({
        message: "Email already registered",
        errors: { email: "Email already registered" },
      });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      const insertUserQuery =
        "INSERT INTO users (email, password) VALUES (?, ?)";
      db.query(
        insertUserQuery,
        [lowerCaseEmail, hashedPassword],
        (err, result) => {
          if (err) {
            return callback(err);
          }
          callback(null, result);
        }
      );
    });
  });
};

module.exports = { createUser };
