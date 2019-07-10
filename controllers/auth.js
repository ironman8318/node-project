const User = require("../models/user")
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator/check")
exports.getLogin = (req,res,next) => {
  
    const error = req.flash("error");
    let passError;
    if(error.length>0){
        passError = error[0];
    }else{
        passError = null;
    }
    res.render("auth/login" ,{pageTitle : "Login",isAuthenticated : req.session.isLoggedIn,error : passError});
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return  res.status(422).render("auth/login" ,{ pageTitle : "Login" ,isAuthenticated : req.session.isLoggedIn, error : error.array()[0].msg,oldInput : {

        }})
    }
        
    User.findOne({email : email}).then(user => {
        if(!user){
           return res.redirect("/login")
        }
        bcrypt.compare(password , user.password).then( result =>{
            if(result){
                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save(err => {
                    res.redirect(("/"))
                    
                })

            }else{
                req.flash("error","Incorrect Password!!!");
                res.redirect("/login");

            }
        } ).catch(err => {
            const error = new Error(err);
            error.setHTTPCode = 500;
            next(error);
        })
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })

}



exports.postLogout = (req,res,next) => {
    
   req.session.destroy(() =>{
       
       res.redirect('/');
   })
}


exports.getSignup = (req,res,next) => {
    let passError;
    const error = req.flash("error")
    if(error.length>0){
        passError = error[0];
    }else{
        passError = null;
    }
    res.render("auth/signup" ,{ pageTitle : "Signup" ,isAuthenticated : req.session.isLoggedIn, error : passError, prePopulate : false ,errorArray : []})
}

exports.postSignup = (req,res,next) => {
    const password = req.body.password;
    const email  = req.body.email;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return  res.render("auth/signup" ,{ pageTitle : "Signup" ,isAuthenticated : req.session.isLoggedIn, error : error.array()[0].msg,prePopulate : true,oldInput : {
            email : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword

        },errorArray : error.array()})
    }
    
        bcrypt.hash(password , 12).then(password =>{
            const user = new User({
                email : email,
                password : password,
                cart : {items : []}
            })
            user.save().then(() => {
                res.redirect("/login")
        
            })
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })

    
}