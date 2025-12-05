const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userLogout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect("/login")
    })
};

module.exports.userSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    let newUser = new User({ email, username });

    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to BookMyStay!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("failure", e.message);
    res.redirect("/signup");
  }
};

module.exports.userLogin = async (req, res) => {
  req.flash("success", "Welcome Back to BookMyStay");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};