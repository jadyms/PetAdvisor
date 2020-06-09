var express = require("express");
var router = express.Router({mergeParams:true});
var Sunset = require("../models/sunset");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments form
router.get("/new", middleware.isLoggedIn, function(req,res){
	Sunset.findById(req.params.id, function(err, sunset){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {sunset:sunset});

		}
	})
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req,res){
	Sunset.findById(req.params.id, function(err, sunset){
		if(err){
			console.log(err);
			res.redirect("/sunsets");
		}else{
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log(err);
				}else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                   comment.save();
                    sunset.comments.push(comment);
                    //save 
					sunset.save();
					req.flash("success", "Comment created");
					res.redirect("/sunsets/" + sunset._id);
				}
			})
		}
	});
});

//Comments edit
router.get("/:comment_id/edit", middleware.isOwner, function(req,res){
	Sunset.findById(req.params.id, function(err, foundSunset){
		if(err || !foundSunset){
			req.flash("error", "Data not found");
			return res.redirect("back");
		}

	Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{sunset_id: req.params.id, comment:foundComment });

		}
	})
})
});

//Comment update
router.put("/:comment_id", function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment updated");
			res.redirect("/sunsets/" + req.params.id);
		}
	})
})

//Comment destroy 
router.delete("/:comment_id", middleware.isOwner, function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/sunsets/" + req.params.id);
		}
	})
	
})



module.exports = router;