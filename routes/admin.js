//core modules
const path = require('path');

//3rd party packages
const express = require('express');

//custom inported files
const rootDir = require('../util/path');
const productsController= require('../controllers/products');

const isAuth = require("../middleware/isAuth");
const router = express.Router();
const multer = require("multer");
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images/');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
var upload = multer({storage : fileStorage});

router.get('/add-product',isAuth,productsController.getAddProducts);


router.post('/edit-product',isAuth,productsController.postEditProducts);

router.get('/edit-product/:productId',isAuth,productsController.getEditProducts);

router.delete("/delete-product/:productId" ,isAuth,productsController.deleteProducts);


router.get('/products',isAuth,productsController.getProducts);


router.post('/add-product',isAuth,productsController.postAddProducts);

module.exports = router;

