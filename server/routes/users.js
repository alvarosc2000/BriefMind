const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  updateUserPlan,
  buyExtraBrief,
  getUserPlan
} = require('../controllers/userController');

// Rutas de usuario
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/:userId/plan', updateUserPlan);
router.put('/:userId/buy-brief', buyExtraBrief);
router.get('/:userId/info-plan', getUserPlan);

module.exports = router;
