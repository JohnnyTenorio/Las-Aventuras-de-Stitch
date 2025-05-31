// Recuperar nombre guardado desde localStorage
const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

const tituloNombre = document.getElementById('tituloNombre');
const btnComenzar = document.getElementById('btnComenzar');
const quizContainer = document.getElementById('quizContainer');
const preguntaElem = document.getElementById('pregunta');
const opcionesElem = document.getElementById('opciones');
const btnReintentar = document.getElementById('btnReintentar');
const btnSiguiente = document.getElementById('btnSiguiente');
const timerElem = document.getElementById('timer');
const imagenElem = document.getElementById('imagenPregunta');

const resultadoContainer = document.getElementById('resultadoContainer');
const nombreResultado = document.getElementById('nombreResultado');
const tablaResultadosBody = document.querySelector('#tablaResultados tbody');
const puntajeFinal = document.getElementById('puntajeFinal');
const btnContinuar = document.getElementById('btnContinuar');

tituloNombre.textContent = `¡Bienvenido/a, ${nombreUsuario}!`;

const preguntas = [
  {
    pregunta: "¿Cuál es el nombre completo de Stitch?",
    opciones: ["Experiment 626", "Stitch Azul", "Ohana", "Lilo"],
    correcta: 0,
    imagen: "../img/stitch_800x600_7c896288.png"
  },
  {
    pregunta: "¿Quién es la mejor amiga de Stitch?",
    opciones: ["Lilo", "Nani", "Jumba", "Pleakley"],
    correcta: 0,
    imagen: "../img/LILO.jpg"

  },
  {
    pregunta: "¿Dónde ocurre la historia principal de Stitch?",
    opciones: ["Hawái", "California", "Florida", "Nueva York"],
    correcta: 0,
    imagen: "https://es.ncl.com/sites/default/files/900x559_hawaii_04102023.jpg"

  },
  {
    pregunta: "¿Qué significa 'Ohana'?",
    opciones: ["Familia", "Amistad", "Aventura", "Casa"],
    correcta: 0,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSP-IKU9Y1LKerJKMcU-biELT4DAQjGqP4w&s"

  },
  {
    pregunta: "¿Quién creó a Stitch?",
    opciones: ["Jumba", "Pleakley", "Lilo", "David"],
    correcta: 0,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc6M169uA5uOL2IdHLz93z2ACLSdnAUqMogg&s"
    
  },
  {
    pregunta: "¿Qué color es Stitch?",
    opciones: ["Azul", "Rojo", "Verde", "Amarillo"],
    correcta: 0,
    imagen: "https://i.pinimg.com/736x/7a/71/36/7a713668d1e3d7b0c138a3161107fdea.jpg"

  },
  {
    pregunta: "¿Cómo se llama la hermana mayor de Lilo?",
    opciones: ["Nani", "Mertle", "Cobra Bubbles", "David"],
    correcta: 0,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9_jRAwfrPMxgO1ZXd9ytUwtjwWonboLZUEQ&s"

  },
  {
    pregunta: "¿Qué tipo de criatura es Stitch?",
    opciones: ["Experimento genético", "Alienígena", "Perro", "Híbrido"],
    correcta: 0,
    imagen: "https://www.excelsior.com.mx/media/pictures/2025/05/12/3305984.jpg"

  },
  {
    pregunta: "¿Qué le gusta hacer a Stitch?",
    opciones: ["Destruir cosas", "Bailar", "Cantar", "Dormir"],
    correcta: 0,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-6DxcC0tZjW8gueHmMZOz49C4ymTb3uOW1g&s"

  },
  {
    pregunta: "¿Qué significa 'Aloha'?",
    opciones: ["Siuu", "Hola y Adiós", "Gracias", "Amor"],
    correcta: 1,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh8CS9TPVektQb-0GKMnVnAiv1rn30hEuvbQ&s"

  }
];

let indicePregunta = 0;
let respuestas = [];
let timer;
let tiempoRestante = 60;

btnComenzar.addEventListener('click', iniciarQuiz);
btnSiguiente.addEventListener('click', siguientePregunta);
btnContinuar.addEventListener('click', () => {
  const transicion = document.getElementById('transicionStitch');
  transicion.style.display = 'flex'; // Mostrar el div de transición
  setTimeout(() => {
    window.location.href = '../html/FotodeRecuerdo.html';
  }, 5000);
});

function iniciarQuiz() {
  
  const audio = document.getElementById('audioFondo');
  if (audio) {
    audio.play().catch(error => {
      console.log("El navegador impidió la reproducción automática. El usuario debe interactuar.");
    });
  }

  btnComenzar.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  indicePregunta = 0;
  respuestas = [];
  mostrarPregunta();
  iniciarTimer();
  btnSiguiente.classList.add('hidden');
}

function mostrarPregunta() {
  const preguntaActual = preguntas[indicePregunta];
  preguntaElem.textContent = `Pregunta ${indicePregunta + 1}: ${preguntaActual.pregunta}`;
  opcionesElem.innerHTML = '';
  imagenElem.src = preguntaActual.imagen || '';
  imagenElem.alt = preguntaActual.pregunta;

  preguntaActual.opciones.forEach((opcion, i) => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="opcion" value="${i}" />
      ${opcion}
    `;
    opcionesElem.appendChild(label);
  });

  btnSiguiente.classList.add('hidden');

  // Escuchar selección para mostrar botón siguiente
  opcionesElem.querySelectorAll('input[name="opcion"]').forEach(input => {
    input.addEventListener('change', () => {
      btnSiguiente.classList.remove('hidden');
      clearInterval(timer); // detener timer si responde antes
    });
  });

  tiempoRestante = 60;
  timerElem.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
  iniciarTimer();
}

function iniciarTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    tiempoRestante--;
    timerElem.textContent = `Tiempo restante: ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
      clearInterval(timer);
      btnSiguiente.classList.remove('hidden');
      opcionesElem.querySelectorAll('input[name="opcion"]').forEach(input => {
        input.disabled = true; // deshabilita opciones al terminar el tiempo
      });
    }
  }, 1000);
}

function siguientePregunta() {
  // Obtener respuesta seleccionada
  const seleccionada = document.querySelector('input[name="opcion"]:checked');
  if (seleccionada) {
    respuestas.push(parseInt(seleccionada.value));
  } else {
    // Si no seleccionó, se guarda -1 para indicar que no respondió
    respuestas.push(-1);
  }

  indicePregunta++;

  if (indicePregunta < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  quizContainer.classList.add('hidden');
  resultadoContainer.classList.remove('hidden');
  nombreResultado.textContent = nombreUsuario;

  tablaResultadosBody.innerHTML = '';
  let aciertos = 0;

  preguntas.forEach((p, i) => {
    const tuResp = respuestas[i];
    const correcta = p.correcta;
    const fila = document.createElement('tr');

    const resultadoClass = tuResp === correcta ? 'resultado-correcto' : 'resultado-incorrecto';
    if (tuResp === correcta) aciertos++;

    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.pregunta}</td>
      <td>${tuResp === -1 ? 'No respondida' : p.opciones[tuResp]}</td>
      <td>${p.opciones[correcta]}</td>
      <td class="${resultadoClass}">${tuResp === correcta ? 'Correcto' : 'Incorrecto'}</td>
    `;

    tablaResultadosBody.appendChild(fila);
  });

  puntajeFinal.textContent = `Obtuviste ${aciertos} respuestas correctas de ${preguntas.length}.`;
}

btnReintentar.addEventListener('click', () => {
  resultadoContainer.classList.add('hidden'); // Oculta el resultado
  btnComenzar.classList.remove('hidden');     // Muestra el botón de comenzar
});


