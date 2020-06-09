var mongoose = require("mongoose");
var Comment = require('./comment')

//SCHEMA
var sunsetSchema = new mongoose.Schema({
	name: String,
    image: String,
    price: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"

        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]
});

sunsetSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});

module.exports = mongoose.model("Sunset", sunsetSchema);
