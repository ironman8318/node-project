const Product = require("../models/product")
const auth = require("./auth")


const mongo = require("mongodb");


exports.getAddProducts = (req, res, next) => {
      // console.log(req.session);
  
    res.render('admin/edit-product',{pageTitle : "add Product",editing : false,isAuthenticated : req.session.isLoggedIn});
}


exports.postAddProducts = (req, res, next) => {

    // console.log(req);
    const item = req.body.item;
    // console.log(item)
    const image = req.file;
    const imageUrl = image.path;
    console.log(imageUrl);
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title : item,
        imageURL : imageUrl,
        price : price,
        description : description,
        userId : req.user._id
    });
    // let product;
    product.save().then((result) => {
        // console.log(result);
        // throw new Error("asda");
       return res.redirect("/");
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })
    
}

exports.deleteProducts = (req, res, next) => {
    const productId = req.params.productId;
    Product.deleteOne({_id : productId , userId : req.user._id})
    .then(result => {
        console.log("deleterd prodicts");
        res.json({message : "victory"});
    }).catch(err => {
        console.log(err);
        res.json({message : "Failue"});
        
    })
}




exports.getEditProducts = (req, res, next) => {
    let edit = req.query.edit;
    let productId =req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render('admin/edit-product',{pageTitle : "edit Product" , editing : edit, product : product,isAuthenticated : req.session.isLoggedIn});
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })
        

}



exports.postEditProducts = (req, res, next) => {
    let productId =req.body.productId;
    const item = req.body.item;
    const imageUrl = req.file;
    const price = req.body.price;
    const description = req.body.description;
   
    Product.findById(productId).then(product => {
        console.log(product);
        if(product.userId.toString() !== req.user._id.toString()){
            res.redirect("/");
        }
        product.title = item;
        if(imageUrl){
            product.imageURL = imageUrl.path;
        }

        product.price = price;
        product.description = description;
        product.save().then(result => {
            console.log("Edited Successfully");
            res.redirect("/admin/products");

    }) 
    
    }).catch(err => {
        console.log(err);
    })
    
    

}


exports.getPostProducts = (req, res, next) => {
    let edit = req.query.edit;
    let productId =req.params.productId;
    Product.findById(productId).then( product => {
        res.render('admin/edit-product',{pageTitle : "edit Product" , editing : edit, product : product,isAuthenticated : req.session.isLoggedIn});
    })

}


exports.getProducts = (req, res, next) => {
    // Product.find({userId : req.user._id}).then(products => {
    //     res.render("admin/products" , {products : products , pageTitle : "Admin Products",isAuthenticated : req.session.isLoggedIn})
    // }).catch(err => {
    //     const error = new Error(err);
    //     error.setHTTPCode = 500;
    //     next(error);
    // })
    let page = +req.query.page||1;

    const ITEMS_PER_PAGE = 1;
    let totalItems;
    
    Product.find({userId : req.user._id}).countDocuments().then(totalDocuments =>{
        totalItems = totalDocuments;
        return Product.find().skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        
    })
    .then(products => {
        console.log(products);
           res.render('admin/products',{products:products,
               pageTitle:"Edit",
               isAuthenticated : req.session.isLoggedIn,
            //    editing : false,
               currentPage: page,
               nextPage : page+1,
               previousPage : page-1,
               hasNextPage : (page*ITEMS_PER_PAGE) < totalItems,
               hasPreviousPage: page>1,
               lastPage : Math.ceil((totalItems/ITEMS_PER_PAGE))

           });
          
    })
    .catch(err => {
    const error = new Error(err);
    error.setHTTPCode = 500;
    next(error);
    }) 


}



    

