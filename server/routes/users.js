const express = require('express');
const router = express.Router();
const { createUser, loginUser, updateUserPlan } = require('../controllers/userController');

router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/:userId/plan', updateUserPlan);
// Añadir al final de tu archivo de rutas de usuario
router.post('/:userId/extra-brief', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.briefs_available += 1;
    await user.save();

    return res.status(200).json({ message: 'Brief extra agregado correctamente', briefs_available: user.briefs_available });
  } catch (error) {
    console.error('Error al agregar brief extra:', error);
    return res.status(500).json({ message: 'Error al agregar brief extra' });
  }
});


const { buyExtraBrief } = require('../controllers/userController');
router.post('/:userId/extra-brief', buyExtraBrief);

module.exports = router;
