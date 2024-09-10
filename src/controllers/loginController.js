import { pool } from '../config/db.js';

export const login = (req, res) => {
  const { username, password } = req.body;

  // Ejemplo de consulta usando el pool
  pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
    }

    if (result.length > 0) {
      res.json({ message: 'Login exitoso' });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  });
};
