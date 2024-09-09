import e from "express";
import { creaCarritoCompra } from "../models/rutinaModel.js";

const addToCart=  async (req, res) => {
    const { producto } = req.body;
    console.log(`Recibida solicitud para agregar producto al carrito:`, producto);
  
    const usercar = await creaCarritoCompra.findOne({ id: req.session.usuario });

    if (!usercar) {
        console.log("No se encontró el carrito de compras del usuario");
        return res.json({ mensaje: "No se encontró el carrito de compras del usuario" });
        }
        else {
            console.log("Carrito encontrado:", usercar);

            const productoIndex = usercar.productos.findIndex((p) => p.name === producto.name);

            if (productoIndex !== -1) { // Si el producto ya está en el carrito, se suma la cantidad, si productoIndexno se encuentra el producto en el carrito  es -1 
                usercar.productos[productoIndex].quantity += producto.quantity;
            } else {
                usercar.productos.push(producto);
            }
            await usercar.save();

            req.session.carrito = usercar.productos;

            console.log(`Carrito actualizado:`, req.session.carrito);

            res.json(req.session);

        }



  
  
    console.log(`Carrito actualizado:`, req.session.carrito);
    res.json({ mensaje: "Producto agregado al carrito exitosamente" });
    }



export { addToCart };