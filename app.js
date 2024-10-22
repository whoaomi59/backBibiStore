const express = require("express");
const cors = require("cors"); // Importa cors
const fs = require("fs");
const app = express();
const PORT = 5000;
const path = require("path");

app.use(cors()); // Usa cors para evitar el error
app.use(express.json());

// Leer y escribir en archivo JSON
const readData = () => {
  const dataPath = path.join(__dirname, "data.json"); // Cambia aquí
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
};

const writeData = (data) => {
  try {
    const dataPath = path.join(__dirname, "data.json");
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
    throw error; // Lanza el error para que se maneje en la llamada
  }
};
// Rutas CRUD
app.get("/items", (req, res) => {
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
  try {
    const data = readData();
    const newItem = { id: Date.now(), ...req.body };
    data.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los items.", text: error });
  }
});

app.put("/items/:id", (req, res) => {
  try {
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los items.", text: error });
  }
});

app.delete("/items/:id", (req, res) => {
  try {
    const data = readData();
    const itemId = parseInt(req.params.id);
    const filteredData = data.filter((item) => item.id !== itemId);

    writeData(filteredData);
    res.json({ message: "Item eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los items.", text: error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
