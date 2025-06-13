const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ✅ Registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const userExist = await pool.query(
      'SELECT * FROM users WHERE name = $1 OR email = $2',
      [name, email]
    );

    if (userExist.rows.length > 0) {
      return res.status(409).json({ message: 'Usuario o email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ message: 'Error en servidor' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ message: 'Error en servidor' });
  }
});

module.exports = router;
