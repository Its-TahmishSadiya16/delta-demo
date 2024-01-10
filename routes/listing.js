const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController=require ("../controllers/listings.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });



// index route
router.get("/",wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show route with :id parameter
router.get("/:id", listingController.showForm);

// eidit route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.editForm) );

// create route
router.post("/", isLoggedIn, 
upload.single('listing[image]'),
validateListing,
    wrapAsync(listingController.createListing));



// update route
router.put("/:id", isLoggedIn, isOwner,
upload.single("listing[image]"),
validateListing,
wrapAsync(listingController.updateListing));

// delete route
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;
