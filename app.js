const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const ejs=require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require("./models/user");

app.set('view engine','ejs');
app.set('views','views');

const store = new mongoSessionStore({
    uri : "mongodb://localhost:27017/shop",
    collection : "sessions"
})
// const storage = multer.diskStorage({
//     destination : (req,file,cb) =>{
//         cb(null,"images");
//     },
//     filename : (req,file,cb) =>{
//         cb(null,file.filename);
//     },
// })


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("images"));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  const filter = (req,file,cb) =>{
      if(file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"||
      file.mimetype === "image/jpeg"){
        return cb(null,true);
      }
      cb(null,false);
  }
  try{
      app.use(multer({ storage : fileStorage,fileFilter : filter}).single('image'));  

  }catch(error){
console.log(error)  }
app.use(bodyParser.urlencoded({extended: false}));

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));
app.use("/admin/images",express.static(path.join(__dirname, 'images')));


app.use(session({secret : "i dont know what i am typing" , resave : false , saveUninitialized : false, store : store}));

app.use((req,res,next) => {
    if(!req.session.user){
         next();
        }else{
            User.findById(req.session.user._id)
            .then(user => {
         
                req.user = user;
                next();
            }).catch(err => {
                console.log(err);
            })

    }
})



app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});



app.use((error,req,res,next) => {
console.log(error);
// /    return res.status(500).render("error/500.ejs",{pageTitle : "Something went wrong" , isAuthenticated : false});
 })
// mongodb.mongoClient( ()=> {
//     app.listen(3000);
    
// })

mongoose.connect("mongodb://shop:shop123@ds053539.mlab.com:53539/shop-in-node").then(result => {

    console.log("database connceted");
    app.listen(3000);
}).catch(err =>{
    console.log(err);
})


