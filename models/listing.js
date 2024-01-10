const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true,
    },
    
    image:{
       filename:String,
       url:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
        
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    
});
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
await Review.deleteMany({_id:{$in: listing.reviews}});
    }

    
});


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

