const express = require('express');
const router = express.Router();
const discountsController = require('../controllers/discountsController');

router.post('/add', discountsController.discountAdd);

router.patch('/edit', discountsController.discountEdit);

router.get('/get/:idDiscount', discountsController.getDiscount);

router.delete('/delete/:idToDelete', discountsController.deleteDiscount);

router.get('/getAll', discountsController.getDiscounts);

router.post('/apply', discountsController.applyDiscountToDrone);


module.exports = router;
