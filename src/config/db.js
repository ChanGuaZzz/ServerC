import mysql from 'mysql';
import Mongoose from 'mongoose';

// Configuración de MySQL
let db; // No usar `const` aquí, ya que vamos a reasignar `db` en la reconexión.

const connectMySQL = () => {
  db = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
  });

  return new Promise((resolve, reject) => {
    db.connect(err => {
      if (err) {
        console.error("Error al conectar a MySQL:", err);
        setTimeout(() => connectMySQL().then(resolve).catch(reject), 2000); // Reintentar conexión
      } else {
        console.log("Conexión exitosa a MySQL");
        resolve(db);
      }
    });
  });
};

// Manejo de errores de MySQL
const handleMySQLErrors = () => {
  db.on('error', err => {
    console.error('Error en la conexión a MySQL:', err);
    if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      db.end(() => {
        connectMySQL().catch(err => console.error('Error al reconectar a MySQL:', err));
      });
    }
  });
};

// Configuración de MongoDB
const connectMongoDB = async () => {
  try {
    await Mongoose.connect(process.env.DB_URI);
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
  }
};

// Exportar funciones y variables
export { connectMySQL, connectMongoDB, handleMySQLErrors , db};

// Inicializar conexiones
connectMySQL().then(() => handleMySQLErrors()).catch(err => console.error('Error inicializando conexión MySQL:', err));
