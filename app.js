const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ejsmate = require("ejs-mate");
const ExpressErrors = require("./utils/ExpressErrors.js");
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');



main().then(()=>{console.log("connected to db")}).catch(err=>{console.log(err)});

async function main(){
    await mongoose.connect(mongo_url);
}

const app = express();

const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res)=>{
    res.send("working!");
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currUser = req.user
    next();
})


app.use("/", userRoute);

app.use("/listings", listingRoute);

app.use("/listings/:id/reviews", reviewRoute)

app.use((req, res, next) => {
    next(new ExpressErrors(404, "Page Not Found! Error 404"));
});


app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    res.render("./errors/error.ejs", {statusCode, message});
});

app.listen(port, (req, res)=>{console.log(`listening to port 3000`)});
