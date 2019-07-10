const express = require("express");
const router =  express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator/check")
const User = require("../models/user");
router.get("/login" , authController.getLogin);
router.post("/login" ,check('email').isEmail(), authController.postLogin);
router.post("/logout" , authController.postLogout);

router.get("/signup" ,authController.getSignup);
router.post("/signup" ,check('email').isEmail().withMessage("Invalid email").custom((value,{req}) => {
    return User.findOne({email:value}).then(user =>{
        if(user){
            return Promise.reject("Email already in use");
        }
    })
}),check("password","Please enter a password with 5 characer excludng any special character!!!").isLength({min :5}).isAlphanumeric(),check("confirmPassword").custom((value,{req}) =>{
    if(value !== req.body.password){
        throw new Error("Please Enter the same password in both fields");
    }
    return true;
}),authController.postSignup);



module.exports = router;
