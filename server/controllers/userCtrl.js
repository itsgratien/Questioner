import bcrypt from "bcryptjs";
import pool from "../config/connection";
import userValidation from "../validations/updateUser";
import passwordValidation from "../validations/password";
//@

exports.findUsername = (req, res) => {
  const username = req.params.username;
  pool.query("SELECT * FROM users WHERE username=$1", [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "sorry the requested result could not be found." });
      }
      return res.json(user.rows);
    })
    .catch(e => res.status(500).json(e));
};

//@updateUser
exports.updateUser = (req, res) => {
  const id = req.user.rows[0].id;
  const { errors, isValid } = userValidation(req.body);
  const data = {
    firstname: req.body.firstname.toLowerCase(),
    lastname: req.body.lastname.toLowerCase(),
    username: req.body.username.toLowerCase(),
    email: req.body.email,
    othername: (req.body.othername) ? req.body.othername : "",
    phoneNumber: req.body.phoneNumber
  };
  //
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.query("SELECT * FROM users WHERE id=$1", [id])
    .then((user) => {
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "sorry the requested result could not be found." });
      }
      pool.query("SELECT * FROM users WHERE id!=$1", [id])
        .then((users) => {
          const result = users.rows;
          for (let i = 0; i < result.length; i++) {
            if (result[i].username === data.username) {
              return res.status(400).json({ error: "username already exist." });
            }
            if (result[i].email === data.email) {
              return res.status(400).json({ error: "email already exist." });
            }
          }
          //updateUser
          pool.query("UPDATE users SET firstname=$1,lastname=$2,username=$3,email=$4,"
        + "othername=$5,phoneNumber=$6 WHERE id=$7",
          [data.firstname, data.lastname, data.username, data.email,
            data.othername, data.phoneNumber, id])
            .then((datas) => {
              if (datas) {
                return res.json({ success: true, message: "updated successfully.", user: data });
              }
              return res.status(500).json({ error: "something wrong try again later." });
            })
            .catch(updErr => res.status(500).json({ error: /*updErr*/"something wrong try again later." }));
        })
        .catch(usersErr => res.status(500).json({ error: /*usersErr*/"something wrong try again later." }));
    })
    .catch(e => res.status(500).json({ error: /*e*/"something wrong try again later." }));
};

//@deleteUser
exports.deleteUser = (req, res) => {
  const id = req.user.rows[0].id;
  pool.query("SELECT * FROM users WHERE id=$1", [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "the requested result could not be found." });
      }
      //@delete query
      pool.query("DELETE FROM users WHERE id=$1", [id])
        .then((user) => {
          if (user) {
            return res.json({ success: true, message: "deleted successfully." });
          }
          return res.status(500).json({ error: "something wrong try again later." });
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(error => res.status(500).json(error));
};

//@changePassword
exports.changePassword = (req, res) => {
  const id = req.user.rows[0].id;
  const data = {
    newpassword: req.body.newpassword,
    recentpassword: req.body.recentpassword
  };
  const { errors, isValid } = passwordValidation(req.body);
  //@check
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  pool.query("SELECT * FROM users WHERE id=$1", [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "the requested result could not be found." });
      }
      //@compare bcrypt
      bcrypt.compare(data.recentpassword, result.rows[0].password,
        (er, isMatch) => {
          if (er) {
            res.status(500).json(er);
          }
          if (!isMatch) {
            return res.status(400).json({ error: "recent password is incorrect." });
          }
          //@hash password
          bcrypt.genSalt(10, (ers, salt) => {
            if (ers) {
              res.status(500).json(ers);
            }
            bcrypt.hash(data.newpassword, salt, (hashErr, hash) => {
              if (hashErr) {
                res.status(500).json({ error: /*hashErr*/"something wrong,try again later." });
              }
              data.newpassword = hash;
              //@change password
              pool.query("UPDATE users SET password=$1 WHERE id=$2", [data.newpassword, id])
                .then((datas) => {
                  if (datas) {
                    return res.json({ success: true, message: "password changed successfully." });
                  }
                  return res.status(500).json({ error: "something wrong try again later." });
                })
                .catch((updErr) => {
                  res.status(500).json({ error: /*updErr*/"server error,please wait for short time." });
                });
            });
          });
        });
    })
    .catch(error => res.status(500).json({ error: "server error,please wait for short time." }));
};

exports.findById = (req, res) => {
  const userId = req.user.rows[0].id;
  pool.query("SELECT * FROM users WHERE id=$1", [userId])
    .then((user) => {
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "sorry the requested result could not be found." });
      }
      return res.status(200).json({ user: user.rows[0] });
    })
    .catch(e => res.status(500).json({ error: e }));
};
//changeProfile
exports.changeProfile = (req, res) => {
  const userId = req.user.rows[0].id;
  if (!req.file) {
    return res.status(400).json({ error: "profile image is required." });
  }
  //logic
  const url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  const sql = "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING*";
  //
  pool.query(sql, [url, userId])
    .then(user => res.status(200).json({
      success: "true",
      message: "profile picture updated successfully.",
      user: user.rows[0]
    }))
    .catch(error => res.status(500).json({ error }));
};
