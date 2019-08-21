// ====================
// COMMENTS ROUTES
// ====================

var express = require("express");
var router = express.Router({mergeParams: true}); // mergeparams to make sure the ":id" part makes it through
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // index is automatically required

// NEW ROUTE
router.get("/new",middleware.isLoggedIn, function(req, res){ // isLoggedIn prevents without login commenting
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

// CREATE COMMENT ROUTE
router.post("/",middleware.isLoggedIn, function(req, res){ // isLoggedIn prevents without login commenting via direct post
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        req.flash("success", "Comment created successful");
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               // add username and id to the particular comment "comment.author.username" refers to the model
                comment.author.id = req.user._id;
                comment.author.username = req.user.username
               // save comment
               comment.save();
                foundCampground.comment.push(comment);
                foundCampground.save();
                console.log(comment);
                res.redirect('/campgrounds/' + foundCampground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


//  COMMENT EDIT ROUte

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        }
    });
})

// COMMENT Update ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Updated")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

//Destroy Campground route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds/");
        } else {
            req.flash("success", "Comment Deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;