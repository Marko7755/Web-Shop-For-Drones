const express = require('express');
const router = express.Router();
const manufacturersController = require('../controllers/manufacturersController');

router.post('/add', manufacturersController.manufacturerAdd);
router.get('/getAll', manufacturersController.getManufacturers);
router.get('/get', manufacturersController.getManufacturer);
router.patch('/edit', manufacturersController.editManufacturer);
router.delete('/delete/:idManufacturer', manufacturersController.deleteManufacturer);

module.exports = router;



