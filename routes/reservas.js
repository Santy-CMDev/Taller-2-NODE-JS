const express = require("express");
const router = express.Router();
let { reservas, salas } = require("../data");

const validarReserva = (nuevaReserva) => {
  const nuevaFechaInicio = new Date(nuevaReserva.fechaInicio);
  const nuevaFechaFin = new Date(nuevaReserva.fechaFin);

  return !reservas.some((reserva) => {
    const reservaFechaInicio = new Date(reserva.fechaInicio);
    const reservaFechaFin = new Date(reserva.fechaFin);

    return (
      reserva.salaId == nuevaReserva.salaId &&
      ((nuevaFechaInicio >= reservaFechaInicio &&
        nuevaFechaInicio < reservaFechaFin) ||
        (nuevaFechaFin > reservaFechaInicio &&
          nuevaFechaFin <= reservaFechaFin))
    );
  });
};

router.get("/", (req, res) => {
  const reservasConNombres = reservas.map((reserva) => {
    const sala = salas.find((s) => s.id == reserva.salaId);
    return { ...reserva, salaNombre: sala ? sala.nombre : "Sala desconocida" };
  });
  res.json(reservasConNombres);
});

router.post("/", (req, res) => {
  const { salaId, nombreReservante, fechaInicio, fechaFin } = req.body;
  const sala = salas.find((s) => s.id == salaId);

  if (!sala || sala.estado !== "activo") {
    return res.status(400).json({ message: "Sala no disponible" });
  }

  const nuevaReserva = {
    id: reservas.length + 1,
    salaId,
    nombreReservante,
    fechaInicio,
    fechaFin,
    salaNombre: sala.nombre,
  };

  if (!validarReserva(nuevaReserva)) {
    return res
      .status(400)
      .json({ message: "La reserva se solapa con otra existente" });
  }

  reservas.push(nuevaReserva);
  res.status(201).json({ message: "Reserva creada", reserva: nuevaReserva });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  reservas = reservas.filter((reserva) => reserva.id != id);
  res.json({ message: "Reserva eliminada" });
});

module.exports = router;
