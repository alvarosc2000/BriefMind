const db = require('../db'); // tu conexión a la DB
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey123';

// Registro
async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    // Verificar si existe el usuario
    const userExists = await db.query('SELECT * FROM users WHERE name = $1 OR email = $2', [name, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario o email ya registrado' });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({ user: result.rows[0], message: 'Usuario registrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en servidor' });
  }
}

// Login
async function loginUser(req, res) {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE name = $1', [name]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en servidor' });
  }
}

module.exports = { registerUser, loginUser };
