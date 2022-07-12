
const express = require('express');
const Route = express.Router();
const validateCategory = require('../../../middlewares/validateCategory');
const CategoryController = require('../../../controllers/CategoryController');
Route.get('/add', CategoryController.create);
Route.post('/add',validateCategory,
CategoryController.insert);
Route.get('/list',  CategoryController.index);
Route.get('/edit/:slug', CategoryController.show);
Route.post('/edit/:slug', validateCategory,CategoryController.update);
Route.post('/delete',  CategoryController.destroy);
module.exports =  Route ;