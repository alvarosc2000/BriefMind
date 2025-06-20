const db = require('../db'); // conexión a PostgreSQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey123';

class UserController {
  async createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
      const existingUser = await db.query(
        'SELECT * FROM users WHERE name = $1 OR email = $2',
        [name, email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Usuario o email ya registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.query(
        `INSERT INTO users (name, email, password, briefs_available, briefs_used, price_per_extra_brief, subscription_plan)
         VALUES ($1, $2, $3, 0, 0, 0, '')
         RETURNING id, name, email, briefs_available, briefs_used, price_per_extra_brief, subscription_plan`,
        [name, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        user: {
          ...user,
          user_brief: 0,
          needsPayment: true,
        },
        token,
      });
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }

  async loginUser(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
      const result = await db.query('SELECT * FROM users WHERE name = $1', [name]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      const briefsRemaining = user.briefs_available - user.briefs_used;

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          briefs_available: user.briefs_available,
          briefs_used: user.briefs_used,
          user_brief: briefsRemaining,
          needsPayment: briefsRemaining <= 0,
          subscription_plan: user.subscription_plan,
          price_per_extra_brief: user.price_per_extra_brief,
        },
        token,
      });
    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ message: 'Error en el login' });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const user = result.rows[0];
      const briefsRemaining = user.briefs_available - user.briefs_used;

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        briefs_available: user.briefs_available,
        briefs_used: user.briefs_used,
        user_brief: briefsRemaining,
        needsPayment: briefsRemaining <= 0,
        subscription_plan: user.subscription_plan,
      });
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      res.status(500).json({ message: 'Error al obtener usuario' });
    }
  }

  async updateUserPlan(req, res) {
    const { id } = req.params;
    const { plan } = req.body;

    try {
      let briefs_available = 0;
      let price_per_extra_brief = 0;

      if (plan === 'Básico') {
        briefs_available = 3;
        price_per_extra_brief = 7;
      } else if (plan === 'Pro') {
        briefs_available = 10;
        price_per_extra_brief = 5;
      } else if (plan === 'Equipo') {
        briefs_available = 30;
        price_per_extra_brief = 3;
      } else {
        return res.status(400).json({ message: 'Plan no válido' });
      }

      const result = await db.query(
        `UPDATE users
         SET briefs_available = $1, briefs_used = 0, price_per_extra_brief = $2, subscription_plan = $3
         WHERE id = $4
         RETURNING id, name, briefs_available, briefs_used, price_per_extra_brief, subscription_plan`,
        [briefs_available, price_per_extra_brief, plan, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const user = result.rows[0];

      res.status(200).json({
        message: 'Plan actualizado',
        user: {
          ...user,
          user_brief: user.briefs_available - user.briefs_used,
          needsPayment: false,
        },
      });
    } catch (err) {
      console.error('Error al actualizar plan:', err);
      res.status(500).json({ message: 'Error al actualizar plan' });
    }
  }

  async buyExtraBrief(req, res) {
    const { id } = req.params;

    try {
      const result = await db.query(
        `UPDATE users
         SET briefs_available = briefs_available + 1
         WHERE id = $1
         RETURNING briefs_available, briefs_used`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const user = result.rows[0];

      res.status(200).json({
        message: 'Brief extra comprado',
        briefs_available: user.briefs_available,
        user_brief: user.briefs_available - user.briefs_used,
      });
    } catch (err) {
      console.error('Error al comprar brief extra:', err);
      res.status(500).json({ message: 'Error al comprar brief extra' });
    }
  }
}

module.exports = new UserController();
