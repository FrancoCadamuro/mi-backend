const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const Alumno = require('./models/Alumno');
///////////ultima mod
app.use(express.static(path.join(__dirname, 'public')));
const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));


// ✅ Ruta HTML global (antes de app.use('/api', ...))
app.get('/api/confirmaciones/html', async (req, res) => {
  try {
    const alumnos = await Alumno.find().sort({ fechaConfirmacion: -1 });
    let html = `
      <html><head><title>Confirmaciones</title></head>
      <body><h2>Listado de confirmaciones</h2>
      <table border="1" cellpadding="5">
      <tr><th>DNI</th><th>Nombre</th><th>Apellido</th><th>Curso</th><th>Confirmado</th><th>Fecha</th></tr>`;
    alumnos.forEach(a => {
      html += `<tr>
        <td>${a.dni}</td>
        <td>${a.nombre}</td>
        <td>${a.apellido}</td>
        <td>${a.curso}</td>
        <td>${a.confirmado ? '✅' : '❌'}</td>
        <td>${a.fechaConfirmacion ? new Date(a.fechaConfirmacion).toLocaleString() : ''}</td>
      </tr>`;
    });
    html += '</table></body></html>';
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando el HTML');
  }
});

// ✅ Luego montás tus rutas API normales
app.use('/api', require('./routes/alumnos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
