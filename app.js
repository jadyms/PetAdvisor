var dotenv = require('dotenv').config(); //Credentials for MongoDB
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"); 
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override")
var flash = require("connect-flash");
Sunset = require("./models/sunset");
Comment = require("./models/comment");
User = require("./models/user");

seedDB = require("./seeds");
//seedDB();

//Require routes
var sunsetRoutes = require("./routes/sunsets");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
mongoose.connect(process.env.DB_CONNECT)
.then(() => console.log(`Database connected`))
.catch(err => console.log(`Database connection error: ${err.message}`));
app.use(flash());
app.use(require("express-session")({
	secret:"Another day another dollar",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
})

app.use(methodOverride("_method"));

app.use(authRoutes);
app.use("/sunsets/:id/comments",commentRoutes);
app.use("/sunsets",sunsetRoutes);




// Listening the requests
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server has started!");
});