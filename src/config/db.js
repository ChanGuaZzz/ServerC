// config/db.js
import mysql from "mysql";
import Mongoose from "mongoose";

const db = mysql.createConnection({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});

db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    setTimeout(() => {
      connectMySQL(); // Reintentar conexión
    }, 2000);
  } else {
    console.log("Conexión exitosa a MySQL");
  }
});

const connectMongoDB = async () => {
  try {
    await Mongoose.connect(process.env.DB_URI);
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
  }
};

export { db, connectMongoDB };