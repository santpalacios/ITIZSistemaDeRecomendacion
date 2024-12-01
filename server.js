const express = require('express');
const bodyParser = require('body-parser');
const { kmeans } = require('ml-kmeans'); 

const app = express();
const port = 3000;


app.use(express.static(__dirname));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/formulario.html');
});

app.post('/predict', (req, res) => {
  const data = [
    [1, 3, 2, 3, 2, 2, 3, 2], 
    [2, 2, 3, 1, 3, 1, 2, 3],
    [3, 1, 1, 2, 1, 3, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2],

  ];

  const userResponse = [
    req.body.areaInteres,
    req.body.matematicas,
    req.body.liderazgo,
    req.body.resolucionProblemas,
    req.body.tecnologiaAvanzada,
    req.body.deporte,
    req.body.actividadCultural,
    req.body.estrategia
  ];

  const recomendacionesPorCluster = {
    0: {
      carreras: [
        'Ingeniería en Sistemas',
        'Ingeniería Industrial',
      ],
      actividades: [
        'Básquetbol',
        'Club de Lectura',
        'Ajedrez',
      ],
    },
    1: {
      carreras: [
        'Ingeniería en Mecatrónica',
        'Gestión Empresarial',
      ],
      actividades: [
        'Fútbol',
        'Danza',
        'Teatro',
      ],
    },
  };

  try {
  
    const result = kmeans(data, 2);

 
    const distances = result.centroids.map(centroid => {
      return Math.sqrt(centroid.reduce((sum, value, index) => {
        return sum + Math.pow(value - userResponse[index], 2);
      }, 0));
    });

    const clusterIndex = distances.indexOf(Math.min(...distances));

 
    let recomendaciones = 'Recomendaciones basadas en tus intereses:\n\n';
    const clusterRecomendaciones = recomendacionesPorCluster[clusterIndex];

    if (clusterRecomendaciones) {
      recomendaciones += 'Carreras recomendadas:\n' + clusterRecomendaciones.carreras.join('\n') + '\n\n';
      recomendaciones += 'Actividades extraescolares recomendadas:\n' + clusterRecomendaciones.actividades.join('\n') + '\n';
    } else {
      recomendaciones += 'No se encontraron recomendaciones para el cluster seleccionado.';
    }


    res.json({ recomendaciones });
  } catch (error) {
    console.error('Error en el clustering:', error);
    res.status(500).json({ error: 'Error al procesar los datos.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});