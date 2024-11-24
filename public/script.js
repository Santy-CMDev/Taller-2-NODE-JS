const apiUrl = "http://localhost:3000";

const formSala = document.getElementById("form-sala");
const listaSalas = document.getElementById("lista-salas");
const formReserva = document.getElementById("form-reserva");
const salaReserva = document.getElementById("sala-reserva");
const historialReservas = document.getElementById("historial-reservas");

async function obtenerSalas() {
  const response = await fetch(`${apiUrl}/api/salas`);
  const salas = await response.json();

  listaSalas.innerHTML = "";
  salaReserva.innerHTML = "<option value=''>Seleccione una sala</option>";

  salas.forEach((sala) => {
    const li = document.createElement("li");
    li.classList.add("sala-item");
    li.innerHTML = `
      <div class="sala-info">
        <strong>${sala.nombre}</strong>
        <span>Capacidad: ${sala.capacidad}</span>
        <span>Estado: ${sala.estado}</span>
      </div>
      <button class="delete" data-id="${sala.id}" title="Eliminar sala">
        <i class="fas fa-trash"></i>
      </button>
    `;
    listaSalas.appendChild(li);

    if (sala.estado === "activo") {
      const option = document.createElement("option");
      option.value = sala.id;
      option.textContent = sala.nombre;
      salaReserva.appendChild(option);
    }
  });

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", eliminarSala);
  });
}

async function guardarSala(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre-sala").value;
  const capacidad = parseInt(document.getElementById("capacidad-sala").value);
  const estado = document.getElementById("estado-sala").value;

  await fetch(`${apiUrl}/api/salas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, capacidad, estado }),
  });

  formSala.reset();
  obtenerSalas();
}

async function eliminarSala(event) {
  const id = event.target.closest("button").dataset.id;

  if (confirm("¿Estás seguro de que deseas eliminar esta sala?")) {
    await fetch(`${apiUrl}/api/salas/${id}`, { method: "DELETE" });
    obtenerSalas();
  }
}

async function obtenerHistorialReservas() {
  const response = await fetch(`${apiUrl}/api/reservas`);
  const reservas = await response.json();

  historialReservas.innerHTML = "";

  reservas.forEach((reserva) => {
    const li = document.createElement("li");
    li.classList.add("reserva-item");
    li.innerHTML = `
      <div class="reserva-info">
        <strong>${reserva.nombreReservante}</strong>
        <span>Sala: ${reserva.salaNombre}</span>
        <span>Inicio: ${new Date(reserva.fechaInicio).toLocaleString()}</span>
        <span>Fin: ${new Date(reserva.fechaFin).toLocaleString()}</span>
      </div>
      <button class="delete" data-id="${reserva.id}" title="Eliminar reserva">
        <i class="fas fa-trash"></i>
      </button>
    `;
    historialReservas.appendChild(li);
  });

  document.querySelectorAll(".reserva-item .delete").forEach((btn) => {
    btn.addEventListener("click", eliminarReserva);
  });
}

async function guardarReserva(event) {
  event.preventDefault();

  const nombreReservante = document.getElementById("nombre-reservante").value;
  const salaId = parseInt(document.getElementById("sala-reserva").value);
  const fechaInicio = document.getElementById("fecha-inicio").value;
  const fechaFin = document.getElementById("fecha-fin").value;

  const response = await fetch(`${apiUrl}/api/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreReservante, salaId, fechaInicio, fechaFin }),
  });

  const result = await response.json();
  if (response.ok) {
    formReserva.reset();
    obtenerHistorialReservas();
  } else {
    alert(result.message);
  }
}

async function eliminarReserva(event) {
  const id = event.target.closest("button").dataset.id;

  if (confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
    await fetch(`${apiUrl}/api/reservas/${id}`, { method: "DELETE" });
    obtenerHistorialReservas();
  }
}

formSala.addEventListener("submit", guardarSala);
formReserva.addEventListener("submit", guardarReserva);

obtenerSalas();
obtenerHistorialReservas();
