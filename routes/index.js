var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware")

router.get("/", function(req,res){
	res.render("landing");
});

//show register form
router.get("/register", function(req,res){
	res.render("register");
})
//add new user to the database
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome back " + user.username);
			res.redirect("/sunsets");
		})
	})
})

//show login form
router.get("/login", function(req,res){
	res.render("login");
})

//login process
router.post("/login",passport.authenticate("local", 
{
	successRedirect: "/sunsets",
	
 	failureRedirect: "/login",
}), function(req,res){

})
//user logout
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Successfully logged out")
	res.redirect("/sunsets");
})

module.exports = router;