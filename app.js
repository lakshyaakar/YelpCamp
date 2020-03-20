var express= require("express"),
    app=  express(),
    passport= require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    flash = require("connect-flash"),
    bodyparser= require("body-parser"),
    Campground=require("./models/campground"),
    mongoose= require("mongoose"),
    Comment = require("./models/comments"),
    User  =  require("./models/user"),
    seedDB = require("./seeds");

//Requiring Routes
var authRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campground");
var commentRoutes = require("./routes/comment");


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://lakshya:<password>@cluster0-gane2.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//seedDB(); 
mongoose.connect("mongodb+srv://lakshya:Lakshya@123@cluster0-gane2.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true });
//mongodb+srv://lakshya:<password>@cluster0-gane2.mongodb.net/test?retryWrites=true&w=majority 

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration===============

app.use(require("express-session")({
   secret:"Rusty is cutest",
   resave:false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============================
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");   
   next();
});

app.use(authRoutes);
app.use("/campgrounds/",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The YelpCamp Server Started!"); 
});