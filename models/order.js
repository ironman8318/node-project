const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const orderSchema = new Schema({
    items : 
        [{products : {type : Object },quantity : {type : Number}}]
    ,
    user : {
        username : {
            type: String
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    }
})

module.exports = mongoose.model("Order", orderSchema);