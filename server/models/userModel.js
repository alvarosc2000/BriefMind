const db = require('../db');

const createUser = async (name, email, hashedPassword) => {
  const subscription_plan = 'Ninguno'; // o '' vacío, para que no tenga plan al iniciar
  const briefs_available = 0;
  const briefs_used = 0;
  const price_per_extra_brief = 0;
  const subscription_renewal = null; // o nueva fecha si quieres

  const result = await db.query(
    `INSERT INTO users 
     (name, email, password, subscription_plan, briefs_available, briefs_used, price_per_extra_brief, subscription_renewal)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING id, name, email, subscription_plan, briefs_available, briefs_used, price_per_extra_brief`,
    [name, email, hashedPassword, subscription_plan, briefs_available, briefs_used, price_per_extra_brief, subscription_renewal]
  );

  return result.rows[0];
};


const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = { createUser, getUserByEmail };
