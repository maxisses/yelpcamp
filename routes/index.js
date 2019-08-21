var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


// Main Route
router.get("/", function(req, res){
    res.render("landing");
});


//========================
// AUTH Routes are coming here
//========================


//register form
router.get("/register", function(req, res){
    res.render("register")
});


// register logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.render("register");
        }
        // direct login (ofc optional - could also redirect to a login form)
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome " + user.username + ", your registration was successful")
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req,res){
    res.render("login");
});

// login logic with the "authenticate" middleware
router.post("/login", passport.authenticate("local", 
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }), function(req,res){

});


// logout route

router.get("/logout", function(req, res){
    // comes with passport
    req.flash("success", "Goodbye")
    req.logout();
    res.redirect("/campgrounds");
})

module.exports = router;