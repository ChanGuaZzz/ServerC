import mysql from "mysql";

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  connectionLimit: 10, // Límite de conexiones en el pool
  connectTimeout: 10000, // Tiempo de espera antes de dar timeout
  acquireTimeout: 10000, // Tiempo para adquirir una nueva conexión
  multipleStatements: true, // Permitir múltiples declaraciones (si es necesario)
});

// Función para manejar errores y reconectar
function handleDisconnect() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión del pool:', err);
      
      // Si ocurre un error debido a la pérdida de conexión, intentamos reconectar
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
        console.error('Conexión a MySQL perdida. Intentando reconectar...');

        // Intentar reconexión después de un tiempo
        setTimeout(handleDisconnect, 2000);
      }
    }

    if (connection) {
      console.log('Conexión establecida/reconectada a MySQL');
      connection.release(); // Liberar la conexión de vuelta al pool
    }
  });
}

// Llamar la función de manejo de desconexión en el inicio
handleDisconnect();

// Manejar errores globales del pool
pool.on('error', (err) => {
  console.error('Error en la conexión MySQL:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
    console.error('Conexión a MySQL perdida. Intentando reconectar...');
    handleDisconnect();
  }
});

export { pool };
