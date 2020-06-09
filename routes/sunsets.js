var express = require("express");
var router = express.Router();
var Sunset = require("../models/sunset");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("sunsets/new");
});

//SHOW - details of a sunset
router.get("/:id", function(req,res){
	Sunset.findById(req.params.id).populate("comments").exec(function(err, sunsetFound){
		if(err || !sunsetFound){
        req.flash("error", "Data not found");
        res.redirect("back");
		}else{
			res.render("sunsets/show", {sunset:sunsetFound});
		}
	});
});


router.get("/",  function(req,res){

	//Get all sunsets from DB
	Sunset.find({}, function(err,allSunsets){
		if(err){
			console.log("error");

		}else{
			res.render("sunsets/index", {sunsets: allSunsets, currentUser: req.user} );
		}
	});
}); 

//Create sunset
router.post("/",middleware.isLoggedIn, function(req,res){
	//get data from form
	var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username,
     
    }
	var newSunset = {name: name, image:image, description:description, author:author, price:price}

	//Save new to DB
	Sunset.create(newSunset, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
                //redirect to main page
                req.flash("success", "Successfully created");
			res.redirect("/sunsets");
		}
	});
});

//Edit sunset
router.get("/:id/edit", middleware.isAuthor, function(req,res){
    //Find specific sunset
    Sunset.findById(req.params.id, function(err, foundSunset){
            res.render("sunsets/edit", {sunsets: foundSunset});
      
    });
});

//Update sunset
router.put("/:id", middleware.isAuthor, function(req,res){
    
    //find and update
    Sunset.findByIdAndUpdate(req.params.id,req.body.sunset, function(err, updatedSunset){
        if(err){
            res.redirect("/sunsets");
        }else{
            req.flash("success", "Successfully updated");
            res.redirect("/sunsets/" + req.params.id);
        }
    } )
})

//Destroy route
router.delete("/:id",middleware.isAuthor, async(req, res) => {
    try {
      let foundSunset = await Sunset.findById(req.params.id);
      await foundSunset.remove();
      req.flash("success", "Successfully deleted");
      res.redirect("/sunsets");
    } catch (error) {
      console.log(error.message);
      res.redirect("/sunsets");
    }
  });


module.exports = router;