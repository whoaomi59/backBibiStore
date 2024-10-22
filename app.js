const express = require("express");
const cors = require("cors"); // Importa cors
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(cors()); // Usa cors para evitar el error
app.use(express.json());

// Leer y escribir en archivo JSON
const readData = () => {
  const data = fs.readFileSync("./data.json", "utf8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
};

// Rutas CRUD
app.get("/", (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los items.", text: error });
  }
});

app.post("/items", (req, res) => {
  const data = readData();
  const newItem = { id: Date.now(), ...req.body };
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

app.put("/items/:id", (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const updatedItem = { id: itemId, ...req.body };

  const index = data.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    data[index] = updatedItem;
    writeData(data);
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: "Item no encontrado" });
  }
});

app.delete("/items/:id", (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const filteredData = data.filter((item) => item.id !== itemId);

  writeData(filteredData);
  res.json({ message: "Item eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
