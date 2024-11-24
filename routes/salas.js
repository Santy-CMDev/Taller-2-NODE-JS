const express = require("express");
const router = express.Router();
let { salas } = require("../data");

router.get("/", (req, res) => res.json(salas));

router.post("/", (req, res) => {
  const { nombre, capacidad, estado } = req.body;
  const nuevaSala = { id: salas.length + 1, nombre, capacidad, estado };

  salas.push(nuevaSala);
  res.status(201).json({ message: "Sala creada", sala: nuevaSala });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  salas = salas.filter((sala) => sala.id != id);
  res.json({ message: "Sala eliminada" });
});

module.exports = router;
