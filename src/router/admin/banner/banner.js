
const express = require('express');
const Route = express.Router();
const validateBanner = require('../../../middlewares/validateBanner');
const BannerController = require('../../../controllers/BannerController');
Route.get('/add', BannerController.create);
Route.post('/add',validateBanner,
BannerController.insert);
Route.get('/list',  BannerController.index);
Route.get('/edit/:id', BannerController.show);
Route.post('/edit/:id', validateBanner,BannerController.update);
Route.post('/delete',  BannerController.destroy);
module.exports =  Route ;