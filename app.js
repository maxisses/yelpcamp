var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"), // for not only having put and post
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seed"),
    flash       = require("connect-flash");


// using express router to split up code, requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp");

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "This could be anything I want and it is the secret",
    resave: false,
    saveUninitialized: false
}));

// required to make passport work
app.use(passport.initialize());
app.use(passport.session());

// thats the method to authenticate in the login route
passport.use(new LocalStrategy(User.authenticate()));

// this will manage the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//to pass the user to every!!! route just like e.g. {campground: foundCampground}
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


// using express router to split up code
app.use(indexRoutes);
    // appends /campgrounds to all routes in front
app.use("/campgrounds", campgroundRoutes);
    // appends ... to all routes in front
app.use("/campgrounds/:id/comments", commentRoutes);



// start a web server
app.listen(5000, function(){
   console.log("The YelpCamp Server Has Started!");
});

