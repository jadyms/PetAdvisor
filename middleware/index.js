var Comment = require('../models/comment');
var Sunset = require('../models/sunset');

var middlewareObj = {};

middlewareObj.isAuthor = function(req, res, next){
        if(req.isAuthenticated()){
            Sunset.findById(req.params.id, function(err, foundSunset){
                if(err || !foundSunset){
                    req.flash("error", "Data not found")
                    res.redirect("/sunsets")
                }else{
    
                    if(foundSunset.author.id.equals(req.user._id)){
                             next();
                    }  else {
                        req.flash("error", "You don´t have permission to do that")
                        res.redirect("back");
                }
            }
            });
        }else{
            res.redirect("back");
        }
    
    
    

}

middlewareObj.isOwner = function (req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error","Data not found")
                    res.redirect("back")
                }else{
    
                    if(foundComment.author.id.equals(req.user._id)){
                             next();
                    }  else {
                        req.flash("error", "You don´t have permission to do that")
                        res.redirect("back");
               }
            }
            });
        }else{
            req.flash("error", "Data not found")
            res.redirect("back");
        }
    }
    

    middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must login first")
        res.redirect("/login");
    }


module.exports = middlewareObj;