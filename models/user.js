const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    password : {
        type : String
    },
    email : {
        type : String
    },
    cart : {
        items : [{productId : {type : Schema.Types.ObjectId,ref : 'Product'}, quantity : {type : Number}}]
    }
})

userSchema.methods.addToCart = function(product){
    const existingProductIndex = this.cart.items.findIndex( p =>{ 
        return p.productId.toString() === product._id.toString()});

        console.log(existingProductIndex);
        
        let newQuantity = 1;
        
        const updatedCart = [...(this.cart.items)];
        
        if(existingProductIndex >= 0){
            newQuantity = updatedCart[existingProductIndex].quantity + 1;
            updatedCart[existingProductIndex].quantity = newQuantity;
        }else{
                    
            updatedCart.push({productId :product._id ,quantity : 1});
        }
        this.cart.items = updatedCart;
        return this.save();
         
}

userSchema.methods.deleteCart = function(){
    const cart = { items : []};
    this.cart = cart;
    this.save();
}

userSchema.methods.deleteItem = function(productId){
    const updatedCartItems = this.cart.items.filter(p => {
        return p.productId.toString() !== productId.toString();
        
    })

    this.cart.items = updatedCartItems;
    return this.save();
}

module.exports = mongoose.model("User" , userSchema);



// const mongo = require("mongodb");
// const getDB = require("../util/database").getDB;

// module.exports = class User{
//     constructor(username,email,cart,id){
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save(){
//         const db = getDB();
//         return db.collection("users").insertOne(this)
//         .then(result => {
//             console.log(result);
//         }).catch(err => {
//             console.log(err);
//         })
//     }

//     addToCart(product){
       
//         return db.collection("users").updateOne({_id : new mongo.ObjectId(this._id) ,},{$set : {cart : upcart}})
//     }


//     order(){
//         const db =getDB();
//        return  this.getCart().then(product => {
//             const order  ={
//                 items : product,
//                 user : {
//                     _id : new mongo.ObjectId(this._id)
//                 }
//             }
//             return db.collection("orders").insertOne(order);
//         })
//         .then(result => {
//             this.cart  = { items : []};
//             return db.collection("users").updateOne({_id : new mongo.ObjectId(this._id)},{ $set : {cart : { items : [] }}})
//         })
//     }  

//     getOrder(){
//         const db = getDB();
//         return db.collection("orders").find({ "user._id" : new mongo.ObjectId(this._id)}).toArray()
//     }

//     static findById(id){
//         const db = getDB();
//         return db.collection("users").find({_id : new mongo.ObjectId(id)}).next()
//         .then(user => {
//             return user;
//         }).catch(err => {
//             return err;
//         })
//     }

//     deleteItem(productId){
//         const updatedCartItems = this.cart.items.filter(p => {
//             console.log("24wqejqwlkeqwkbvilqwurqlqiuqwoirqvwuoi345345453b.3453.5.345/.34/5.4/654/6.4/5.32/4234.2/4.3254/.324/234");
//             console.log( p.productId.toString());
//             console.log(productId.toString())
//             return p.productId.toString() !== productId.toString();
//         })
//         const db = getDB();
//         console.log(updatedCartItems);
        
//         return db.collection("users").updateOne({_id : new mongo.ObjectId(this._id)},{ $set : { cart : {items : updatedCartItems}}})
//     }
    


//     getCart(){
//         const db = getDB();
//         const productIds = this.cart.items.map( i => {
//             return i.productId;
//         })
//         return db.collection("Product").find({_id :{$in : productIds}}).toArray()
//         .then(products => {
//             return products.map( i => {
//                 return { ...i, quantity : this.cart.items.find( p => p.productId.toString() === i._id.toString() ).quantity}
//             })
//         })
        
//     }
// }