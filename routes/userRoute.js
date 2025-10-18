const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render('users/signup.ejs')
})

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect("/login")
    })
})

router.post("/signup", wrapAsync(async(req, res) => {
    try{let {username, email, password} = req.body;

    let newUser = new User({ email, username });

    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
        req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to BookMyStay!");
        res.redirect("/listings");
        }) 
        
        

    }
    
    catch (e) {
        req.flash("failure", e.message);
        res.redirect("/signup")
    }
}));


router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
},), async (req, res) => {
    
    req.flash("success", "Welcome Back to BookMyStay")
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
})

module.exports = router;