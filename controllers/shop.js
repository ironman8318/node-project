const Product = require("../models/product")
const Cart = require("../models/cart")
const User = require("../models/user");
const Order = require("../models/order");
const auth = require("./auth")
const fs = require("fs")
const path = require("path")



exports.getIndex = (req, res, next) => {
    
    let page = +req.query.page||1;

    const ITEMS_PER_PAGE = 1;
    let totalItems;
    
    Product.find().countDocuments().then(totalDocuments =>{
        totalItems = totalDocuments;
        return Product.find().skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        
    })
    .then(products => {
        console.log(products);
           res.render('shop/index',{products:products,
               pageTitle:"Shop",
               isAuthenticated : req.session.isLoggedIn,
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

exports.getCheckout = (req, res, next) => {
    Product.fetchAll((product) => {
        res.render('shop/checkout',{products:product,pageTitle:"Your products",isAuthenticated : req.session.isLoggedIn});
    });
}

exports.getCart = (req, res, next) => {
   req.user
   .populate('cart.items.productId').execPopulate()
   .then(user => {
       console.log("qweeeeeeeeeeeeeeeeeeeeeeeeeee");
       console.log(user);
       products = user.cart.items;
       
       res.render("shop/cart",{products : products ,pageTitle : "Your Cart",isAuthenticated : req.session.isLoggedIn});
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })
}

exports.postOrder = (req,res,next) => {
    
    req.user
   .populate('cart.items.productId').execPopulate()
   .then(user => {
       console.log(user);
      const productss = user.cart.items.map(i => {
        //   console.log({ ...i.productId._doc });
           return { products : { ...i.productId._doc } ,quantity : i.quantity}
       });
    //    console.log(productss);
       const order = new Order(
           {
               items : productss,
               user : {
                   username : req.user.username,
                   userId : req.user._id
               }

           }
           
       )
       return order.save()})
       .then(result => {
        req.user.deleteCart();
    }).then(result => {
        res.redirect("/order");

    })
    
}
exports.getOrder = (req,res,next) => {
    Order.find({'user.userId' : req.user._id }).then(orders => {
        console.log(orders);
        for(let prod of orders){
            for(let item of prod.items){
                
                console.log(item.products.description);
                console.log(item.quantity);

                
            }
        }
        // console.log(products);
        res.render("shop/orders" ,{products :orders ,pageTitle : "YOur aorders",isAuthenticated : req.session.isLoggedIn})
    })
}


exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
       
       return req.user.addToCart(product)
    }).then(result => {
        res.redirect("/cart");
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })
}



exports.postDeleteCartitem = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    req.user.deleteItem(productId).then(result =>{
        console.log("done")
        res.redirect("/cart");
    }).catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })
}


exports.getProducts = (req, res, next) => {
    
    Product.find((product) => {
        res.render('shop/products-list',{products:product,pageTitle:"Products",isAuthenticated : req.session.isLoggedIn});
    });
}

exports.getOrders = (req, res, next) => {
    Product.fetchAll((product) => {
        res.render('shop/orders',{products:product,pageTitle:"Your Order",isAuthenticated : req.session.isLoggedIn});
    });
}

exports.getProductDetail = (req,res,next) => {
    Product.findById(req.params.productId)
    .then(product =>{ res.render("shop/products-detail",{ product : product , pageTitle : "Deatails",isAuthenticated : req.session.isLoggedIn})}) 
    .catch(err => {
        const error = new Error(err);
        error.setHTTPCode = 500;
        next(error);
    })
}

exports.getInvoice = (req,res,next) =>{
    const orderId = req.params.id;
    Order.findById(orderId).then(order =>{
        if(!order){
            return next(new Error("No order found"))
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
             return next(new Error("Not Authorised"))
        }
    }).catch(err => {
        next(new Error("No order")) 
    })
    const p = path.join("data","invoices","invoice.pdf");
    // fs.readFile(p,(err,fileContent) => {
    //     res.setHeader("Content-Type" , "application/pdf");
    //     res.setHeader("Content-Disposition" , "inline");

    //     res.send(fileContent);
    // })
    const file = fs.createReadStream(p);
    res.setHeader("Content-Type" , "application/pdf");
    res.setHeader("Content-Disposition" , 'inline;filename = "invoice' +  orderId + '" ' );
    file.pipe(res);


}