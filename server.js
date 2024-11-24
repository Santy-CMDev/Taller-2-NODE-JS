const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const salasRoutes = require("./routes/salas");
const reservasRoutes = require("./routes/reservas");

app.use("/api/salas", salasRoutes);
app.use("/api/reservas", reservasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
