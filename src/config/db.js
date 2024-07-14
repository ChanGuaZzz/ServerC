// config/db.js
import pkg from "pg";
const { Client } = pkg;
import Mongoose from "mongoose";

// Configuración de PostgreSQL
const db = new Client({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});

// Conexión a PostgreSQL
const connectPostgres = async () => {
  try {
    await db.connect();
    console.log("Conexión exitosa a PostgreSQL");
  } catch (error) {
    console.error("Error de conexión a PostgreSQL:", error);
  }
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