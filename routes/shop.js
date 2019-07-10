//core modules
const path = require('path');

//3rd party packages
const express = require('express');

//custom imported files

const rootDir = require('../util/path');
const shopController= require('../controllers/shop.js');

const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get('/',shopController.getIndex);

router.get('/cart',isAuth,shopController.getCart);

router.post("/cart",isAuth, shopController.postCart)

router.post("/cartDeleteItem",isAuth, shopController.postDeleteCartitem)

router.get('/checkout',isAuth,shopController.getCheckout);
router.post("/order" ,isAuth,shopController.postOrder);
router.get("/order" ,isAuth,shopController.getOrder);

router.get('/products',shopController.getProducts);


router.get('/products/:productId',shopController.getProductDetail);



router.get('/orders',isAuth,shopController.getOrders);

router.get("/invoice/:id",isAuth,shopController.getInvoice)


module.exports=router;