const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shoppingCartController');

router.post('/addItem', shoppingCartController.itemAdd);

router.get('/getItems/:userId', shoppingCartController.getCartItems);

router.delete('/removeItem/:userId/:idDrone', shoppingCartController.removeItem);

module.exports = router;
