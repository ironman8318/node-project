const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let  _db;
exports.mongoClient = (cb) => {
    mongoClient.connect("mongodb://localhost:27017/node")
    .then(result => {
        _db = result.db();
        cb();
        console.log("connected")
    })
    .catch(err => {
        console.log(err);
    })
} 

exports.getDB = () =>{
    if(_db){  return _db;}
    console.log("No DB found!!!!");
}