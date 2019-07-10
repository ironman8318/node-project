const path = require("path");
const fs = require("fs")

const p = path.join(path.dirname(process.mainModule.filename) , 'data' ,"cart.json");


module.exports = class Cart{
    
    static addProduct(id, productPrice){

        /*
        initi\=[;lize a object having list of the products and totalPrice
            =
                products : [{product_ID , quantuty}] ,
                totalPriceOfTheCart : totalprice
            }
        analyze the prevoucart whaeather a product exist or not 
        if exist then update the quantoty and upfate the total price
        if not then add a new product and update the total price
        */

       fs.readFile(p,(err,fileContent) => {
            let cart = { products : [] , totalPrice : 0};
            if(!err){
                cart  = JSON.parse(fileContent);
                
            }
            
            let existingProductIndex = cart.products.findIndex( p => p.id === id);
            let existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            if(existingProduct){
                console.log("found Existing producr")
                updateProduct  = {...existingProduct};
                updateProduct.qty = updateProduct.qty + 1 ;
                cart.products[existingProductIndex] = updateProduct;
            }else{
                updateProduct = { id : id , qty : 1};
                cart.products = [...cart.products , updateProduct];
            }
            cart.totalPrice = cart.totalPrice + Number(productPrice);
            fs.writeFile(p ,JSON.stringify(cart), (err) =>{
                console.log(err);
            })

            
        })

    }
    static deleteProduct(id,productPrice){
        fs.readFile( p ,(err,fileContent) => {
            
            if(err){
                console.log("errir hai bc");
            }else{
                const cart = JSON.parse(fileContent)
                const updateProduct = {...cart};
                const product  = updateProduct.products.find( p => p.id === id);
                console.log(product);
                updateProduct.products = updateProduct.products.filter( p => p.id !== id);
                updateProduct.totalPrice = updateProduct.totalPrice - productPrice*(product.qty);
                fs.writeFile(p , JSON.stringify(updateProduct) ,(err) => {
                    console.log("deleted from cart also");
                })
            }
        })
        
    }


    static getCart(cb){
        fs.readFile(p,(err,fileContent) => {
            if(err){
                cb([]);
            }else{
                cb(JSON.parse(fileContent));
            }

        })
    }
}