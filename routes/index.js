import express from "express";
import consultas from "../controllers/control.js";

const rutas = express.Router();

rutas.get("/", consultas.cargarHome);
rutas.get("/Buscar", consultas.filtrar);
rutas.get("/images", consultas.imagenExtra)
rutas.use((req, res) => {
    res.status(404).render('404');
});

export default rutas;