const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error MongoDB:', err));

// ✅ Ruta HTML antes del use('/api')
app.get('/api/confirmaciones/html', async (req, res) => {
  const Alumno = require('./models/Alumno');
  const alumnos = await Alumno.find().sort({ fechaConfirmacion: -1 });

  let html = `
  <html>
  <head>
    <meta charset="utf-8">
    <title>Confirmaciones</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 30px; }
      h2 { text-align: center; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 8px; }
      th { background: #f2f2f2; }
    </style>
  </head>
  <body>
    <h2>Listado de Confirmaciones 2026</h2>
    <table>
      <tr><th>DNI</th><th>Nombre</th><th>Apellido</th><th>Curso</th><th>Fecha</th></tr>
      ${alumnos.map(a => `
        <tr>
          <td>${a.dni}</td>
          <td>${a.nombre}</td>
          <td>${a.apellido}</td>
          <td>${a.curso}</td>
          <td>${a.fechaConfirmacion ? new Date(a.fechaConfirmacion).toLocaleString('es-AR') : ''}</td>
        </tr>`).join('')}
    </table>
  </body></html>`;

  res.send(html);
});

// ✅ Luego las rutas API
app.use('/api', require('./routes/alumnos'));

// Servir index.html
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
