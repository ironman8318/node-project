
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
    title : {
        type:String,
        required :true
    },
    price : {
        type : Number,
        required : true

    },
    imageURL : {
        type : String
    },
    description : {
        type : String
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }


})

module.exports = mongoose.model("Product" , productSchema);




// // const path = require("path");
// // const fs = require("fs")
// // const p = path.join(path.dirname(process.mainModule.filename) , 'data' ,"products.json");

// // const Cart  = require("./cart");


// // function helper(cb){
// //         fs.readFile(p,(err,fileContent) => {
// //             if(err){
// //                 cb([]);
// //             }else{
// //                  cb(JSON.parse(fileContent));
// //             }
// //         })
        
// //     }


// // module.exports = class Product{
// //     constructor(id,t,imageUrl,price,description){
// //         this.id = id;
// //         this.title = t;
// //         this.imageUrl = imageUrl;
// //         this.price=price;
// //         this.description=description;
// //     }

// //     save(){
// //         //initilize first a product array
// //         //if product found , then add new to it,
// //         //write the product back to the file

// //         console.log("Entered the save()");
// //         console.log(this.id);
// //         helper(products =>{
// //             if(this.id){
// //                 const existingProductIndex = products.findIndex( p => p.id === this.id)
// //                 const updatedProducts = [...products];
// //                 updatedProducts[existingProductIndex] = this;
// //                 console.log(updatedProducts[existingProductIndex]);
// //                 fs.writeFile(p ,JSON.stringify(updatedProducts), (err) =>{
// //                     console.log(err);
                    
// //                 })

// //             }else{
// //                 this.id=Math.random().toString();
// //                 products.push(this);
// //                 fs.writeFile(p ,JSON.stringify(products), (err) =>{
// //                     console.log(err);
                    
// //                 })

// //             }

// //     })
// //     // fs.readFile(p , (err,fileContent) => {
// //     //     let products = [];
// //     //     if(!err){
// //     //         products = JSON.parse(fileContent);
// //     //     }
// //     //     products.push(this);
// //     //     fs.writeFile(p ,JSON.stringify(products), (err) =>{
// //     //         console.log(err);
            
// //     //     })
// //     // }) 

    
// //     }

// //     static fetchAll(cb){
// //         helper(cb);
// //     //     const p = path.join(path.dirname(process.mainModule.filename) , 'data' ,"products.json");
// //     //     fs.readFile(p,(err,fileContent) => {
// //     //         if(err){
// //     //             cb([]);
// //     //         }else{
// //     //              cb(JSON.parse(fileContent));
// //     //         }
// //     //     })
        
// //      }

// //      static findById(id,cb){
// //          helper(products =>{
// //             const product =  products.find( p =>  p.id === id)
// //             cb(product);
// //          })
// //      }

// //      static deleteProduct(id){
// //          helper(products => {
// //              let updatedProducts = products.filter(p => p.id !== id);
// //              fs.writeFile(p,JSON.stringify(updatedProducts),(err) => {
// //                  if(!err){
// //                      console.log("deleted Succesfully");
                    
// //                     Cart.deleteProduct(id, updatedProducts.price);
// //                  }
// //              })
// //          })
// //      }
// // }



// const mongo = require("mongodb");
// const mongodb = require("../util/database");
// let getdatabase = mongodb.getDB;


// module.exports = class Product{
//     conpmnstructor(item , imageURL , price ,description,id,userId){
//         this.title = item;
//         this.imageURL = imageURL;
//         this.price = price;
//         this.description = description;
//         this._id = id;
//         this.userId = userId;
//     }

//     save(){
//     const db = getdatabase();
//     let dbop;
//         if(this._id){
//             dbop = db.collection("Product").updateOne({_id :this._id}, {$set : this});

//         }else{
//             dbop = db.collection("Product").insertOne(this)
//         } 
//          return dbop.then(result => {
//             console.log(result);
//         }).catch(err => {
//             console.log(err);
//         })
    
// }


//     static fetchAll(){
//     const db = getdatabase();

//         return db.collection("Product").find().toArray()
//         .then(products => {
//             return products;
//         }).catch(err => {
//             console.log(err);
//         })
//     }


//     static findById(id){
//         const db = getdatabase();
//         return db.collection("Product").find({_id : new mongo.ObjectId(id)}).next()
//         .then(prodcut => {
//             console.log(prodcut);
//             return prodcut;
//         }).catch(err => {
//             console.log(err);
//         })

//     }


//     static delete(id){
//         const db = getdatabase();
//         return db.collection("Product").deleteOne({_id : new mongo.ObjectId(id)})
//         .then(result =>{
//             return resultl
//         }).catch(err => {
//             return err;
//         })
//     }

// }
