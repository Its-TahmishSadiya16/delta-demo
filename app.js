
if(process.env.NODE_ENV !="production"){
    require ("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listing = require("./routes/listing.js");
const review= require("./routes/review.js");
const user = require("./routes/user.js");
 const { request } = require("http");

/*in lines se hum database setup kar sakhte hai*/
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;



main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}








/*this lines are for appling css and javascript to the website and remember maximum folders and file are in views directory*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// npm i connect mongo karne ke bad 
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter:24*3600, /*jab hume server ko 24 hrs ke baad updat karna hai to*/
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION ",err);
})

/*this is for cookies and also for signup or login */
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    },
};




// app.get("/", (_req, res) => {
//     res.send("Hi,I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*this code is for flashing the messages*/
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
// let fakeUser = new User({
//     email:"student@gamil.com",
//     username:"delta-student"
// });

//  let registeredrUser=await User.register(fakeUser,"helloworld");
//  res.send(registeredrUser);
// });

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);
app.use("/",user);


// app.get("/testlisting",async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My Home",
//         description: "by the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India"
//     });
//   await  sampleListing.save();
//   console.log("sample was saved");
//   res.send("succesful testing");
// });

app.use("*", (_req, _res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, _req, res) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //    res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log("server is listening on port 3000");
});