const express = require('express');
const router = express.Router();
const dronesController = require('../controllers/dronesController');
const multer = require('multer');
const path = require('path');
const usersController = require('../controllers/usersController');

// Define storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../public/webpImg');
    console.log('Uploading to:', uploadPath); // Add logging
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log('Uploading file:', file.originalname); // Add logging
    cb(null, file.originalname);
  }
});

// Allowed MIME types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

// File filter function
const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, and WEBP image formats are allowed!'), false);
  }
  cb(null, true);
};

// Multer instance with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Route to add drone data with pictures
router.post('/add', upload.array('pictures'), (req, res, next) => {
  if (!req.files.length) {
    return res.status(400).json({ error: 'Please upload valid image files (JPG, PNG, WEBP).' });
  }
  next(); // Continue to controller if files are valid
}, dronesController.droneAdd);

router.get('/get/:idOrName', dronesController.getDrone);

router.patch('/edit/:idDrone', upload.array('pictures'), dronesController.editDrone);

router.delete('/delete/:idToDelete', dronesController.deleteDrone);

router.get('/getAll',/*  usersController.authenticateToken, */ dronesController.getAllDrones);

router.get('/getDiscounted', dronesController.getDiscountedDrones);


module.exports = router;