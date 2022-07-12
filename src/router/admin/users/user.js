const express = require('express');
const router = express.Router();
const UserControler = require('../../../controllers/UserController');
router.get('/logout', UserControler.logOut);
router.get('/add', UserControler.create);

module.exports =  router ;