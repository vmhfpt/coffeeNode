const validateProduct = require('../../../middlewares/validateProduct');
const express = require('express');
const Route = express.Router();
const ProductController = require('../../../controllers/ProductController');
Route.get('/add', ProductController.create); 
Route.post('/add',validateProduct,
ProductController.insert);
Route.get('/list',  ProductController.index);
Route.get('/edit/:slug', ProductController.show);
Route.post('/edit/:slug',validateProduct, ProductController.update);
 Route.post('/delete',  ProductController.destroy);
module.exports =  Route ;