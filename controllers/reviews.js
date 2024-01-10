const Listing= require("../models/listing"); 
const Review= require("../models/review");  



module.exports.createReview=(async (req, res) => {
 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review({
      rating: req.body.review.rating,
      comment: req.body.review.comment,
    });
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New review added");
  
    console.log("new review saved");
  
    res.redirect(`/listings/${listing._id}`);
  }
  
  );

  module.exports.destroyReviews=(async (req, res) => {
    let { id, reviewId } = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    
  
    res.redirect(`/listings/${id}`);
  });