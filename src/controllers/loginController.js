import bcrypt from "bcrypt";
import { pool } from "../config/db.js"; // Importamos el pool
import { creaCarritoCompra } from "../models/rutinaModel.js";

const login = async (req, res) => {
  const consulta = "SELECT * FROM usuarios WHERE usuario = ?";
  const values = [req.body.usuario];

  try {
    // Realizamos la consulta a la base de datos usando el pool
    const result = await new Promise((resolve, reject) => {
      pool.query(consulta, values, (err, result) => {
        if (err) {
          console.error("Error en la consulta:", err);
          reject("Error en la consulta a la base de datos");
        } else {
          resolve(result);
        }
      });
    });

    // Verificamos si el usuario existe
    const usercar = await creaCarritoCompra.findOne({ id: req.body.usuario });

    if (result.length > 0) {
      const passwordFromDB = result[0].password;

      // Comparamos la contraseña ingresada con la de la base de datos
      const IsCorrect = await bcrypt.compare(req.body.password, passwordFromDB);

      if (IsCorrect) {
        // Guardamos los datos del usuario en la sesión
        req.session.usuario = result[0].usuario;
        req.session.nombre = result[0].nombre;
        req.session.email = result[0].email;
        req.session.telefono = result[0].telefono;
        req.session.direccion = result[0].direccion;
        req.session.sexo = result[0].sexo;
        req.session.edad = result[0].edad;
        req.session.peso = result[0].peso;
        req.session.altura = result[0].altura;
        req.session.actividadfisica = result[0].actividadfisica;
        req.session.objetivo = result[0].objetivo;
        req.session.numberItems = 0;
        req.session.carrito = usercar ? usercar.productos : [];
        req.session.ObjProteinas = result[0].ObjProteinas;
        req.session.ObjCalorias = result[0].ObjCalorias;

        console.log("Actividad fisica", result[0].actividadfisica);
        console.log("Objetivo", result[0].objetivo);
        console.log(req.session);

        return res.send({ status: "correcto", redirectTo: "/principal" });
      } else {
        return res.json({ Error: "Contraseña incorrecta" });
      }
    } else {
      return res.status(201).json({ Error: "No existe el usuario" });
    }
  } catch (error) {
    console.error("Error general:", error);
    return res.status(500).json({ Error: "Error interno del servidor" });
  }
};

export { login };
