const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Vercel usa su propio puerto

app.use(cors());
app.use(express.json());

// Simulando la lectura y escritura de un archivo
let data = JSON.parse(process.env.DATA || "{}"); // Lee desde una variable de entorno

// Rutas CRUD
app.get("/items", (req, res) => {
  res.json(data);
});

app.post("/items", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  data[newItem.id] = newItem;
  res.status(201).json(newItem);
});

app.put("/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = { id: itemId, ...req.body };

  if (itemId in data) {
    Object.assign(data[itemId], updatedItem);
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

app.delete("/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  delete data[itemId];
  res.json({ message: "Item eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
