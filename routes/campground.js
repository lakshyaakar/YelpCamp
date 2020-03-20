var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Displaying Campgrounds Page.
router.get("/",function(req,res){
   Campground.find({},function(err,allcamps){
   if(err)
      console.log(err);
   else
      res.render("campgrounds/index",{campgrounds:allcamps});
});
});

//creating new campground.
router.post("/", middleware.isLoggedIn, function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var description = req.body.description;
   var author = {
      id: req.user._id,
      username : req.user.username
   }
   Campground.create({
   name: name,
   image: image,
   description: description,
   author: author
},function(err,camp){
   if(err)
      console.log(err);
   else
      res.redirect("/campgrounds");
});
});

//add new campground.
router.get("/new", middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new");
});

//To show or find the campground using ID.
router.get("/:id",function(req,res){
      Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
      if(err)
         console.log(err);
      else
         res.render("campgrounds/show",{campground:foundCamp});
   });
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
//below there is a warning of 'err' not handled... We have handled it in middleware so we do need
//to require handling any error here.
   Campground.findById(req.params.id, function(err,foundCamp){
      if(foundCamp.author.id.equals(req.user._id))
         res.render("campgrounds/edit",{campground:foundCamp});   
      });
   });

//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCamp){
      if(err){
         res.redirect("/campgrounds");
      }
      else{
         req.flash("success","Updated Campground");
         res.redirect("/campgrounds/"+ req.params.id);
//    or res.redirect("/campgrounds"+ updatedCamp._id);     
      }
   });
});

//Destroy Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
      if(err)
         res.redirect("/campgrounds");
      else{
         req.flash("success","Campground Deleted Successfully")
         res.redirect("/campgrounds");
      }
         
   });
});

module.exports = router;