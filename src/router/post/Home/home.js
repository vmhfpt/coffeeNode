
const express = require('express');
const Route = express.Router();
const PostController = require('../../../controllers/PostController');
const DetailController = require('../../../controllers/DetailController');
Route.get('/', PostController.index);
Route.get('/contact', PostController.infor);
Route.get('/:slug', PostController.show);
Route.get('/category/:slug',  DetailController.show);
Route.get('/:category/:slug',  DetailController.showDetail);

module.exports =  Route ;