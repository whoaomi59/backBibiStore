const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Para analizar JSON en el cuerpo de las solicitudes

// Conectar a MySQL
const connection = mysql.createConnection({
  host: "asuprocolombiasas.com", // Pon tu host
  user: "sisottsa_hacker", // Tu usuario
  password: "aAeewMH_WsgE", // Tu contraseña
  database: "sisottsa_shopp", // Tu base de datos
});

// Verificar conexión
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

// Ruta para obtener items
app.get("/items", (req, res) => {
  const query = "SELECT * FROM Productos";

  connection.query(query, (err, results) => {
    if (err) {
      // Maneja el error que ocurre en la consulta SQL
      return res.status(500).json({
        message: "Ocurrió un error al obtener los items.",
        error: err.message, // Mostramos el mensaje de error.
      });
    }

    // Si la consulta se ejecuta sin errores
    try {
      res.status(200).json(results); // Devolvemos los resultados
    } catch (error) {
      // Capturamos errores al intentar devolver la respuesta
      return res.status(500).json({
        message: "Ocurrió un error al procesar la respuesta.",
        error: error.message, // Detallamos el error de la respuesta.
      });
    }
  });
});

// Ruta para agregar un nuevo item
app.post("/items", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO items (name) VALUES (?)";

  connection.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error al agregar item:", err);
      return res
        .status(500)
        .json({ message: "Ocurrió un error al agregar el item." });
    }
    res.status(201).json({ id: result.insertId, name });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
