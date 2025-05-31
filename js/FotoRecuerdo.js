// Obtener nombre del usuario de localStorage
const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

const bienvenida = document.getElementById('bienvenida');
const inputFoto = document.getElementById('inputFoto');
const disenosDiv = document.getElementById('disenos');
const opcionesDiv = disenosDiv.querySelector('.opciones');
const btnGenerar = document.getElementById('btnGenerar');
const resultadoDiv = document.getElementById('resultado');
const canvas = document.getElementById('canvasCollage');
const btnContinuar = document.getElementById('btnContinuar');
const btnRegresar = document.getElementById('btnRegresar');

bienvenida.textContent = `¡Bienvenido/a, ${nombreUsuario}!`;

let fotoUsuario = null;
let diseñoSeleccionado = null;

const stitchImgSrc = '../img/stitch_800x600_7c896288.png';

// Modelos de diseño (posiciones en canvas de la foto y de stitch)
const diseños = [
    { id: 1, descripcion: "Stitch a la derecha", userPos: { x: 20, y: 20, w: 180, h: 180 }, stitchPos: { x: 220, y: 20, w: 150, h: 180 } },
    { id: 2, descripcion: "Stitch a la izquierda", userPos: { x: 200, y: 20, w: 180, h: 180 }, stitchPos: { x: 20, y: 20, w: 150, h: 180 } },
    { id: 3, descripcion: "Stitch arriba", userPos: { x: 60, y: 100, w: 220, h: 180 }, stitchPos: { x: 120, y: 0, w: 150, h: 100 } },
    { id: 4, descripcion: "Stitch abajo", userPos: { x: 60, y: 0, w: 220, h: 180 }, stitchPos: { x: 120, y: 180, w: 150, h: 100 } },
    { id: 5, descripcion: "Stitch detrás (semi-transparente)", userPos: { x: 60, y: 20, w: 220, h: 180 }, stitchPos: { x: 60, y: 20, w: 220, h: 180, opacity: 0.5 } }
];

// Cargar imagen Stitch para previsualización y canvas
const stitchImg = new Image();
stitchImg.src = stitchImgSrc;

// Cuando el usuario carga la foto
inputFoto.addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        fotoUsuario = new Image();
        fotoUsuario.src = event.target.result;
        fotoUsuario.onload = () => {
            mostrarOpcionesDiseno();
        };
    };
    reader.readAsDataURL(archivo);
});

// Mostrar las opciones de diseño (con imagenes mockup)
function mostrarOpcionesDiseno() {
    opcionesDiv.innerHTML = '';
    btnGenerar.disabled = true;
    diseñoSeleccionado = null;
    disenosDiv.classList.remove('hidden');
    resultadoDiv.classList.add('hidden');

    diseños.forEach(diseño => {
        // Crear label con radio e imagen miniatura
        const label = document.createElement('label');
        label.title = diseño.descripcion;

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'diseno';
        radio.value = diseño.id;

        radio.addEventListener('change', () => {
            diseñoSeleccionado = diseño;
            btnGenerar.disabled = false;

            // Marcar visualmente seleccionado
            opcionesDiv.querySelectorAll('label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        });

        // Crear miniatura del collage para mostrar (canvas o imagen)
        const miniCanvas = document.createElement('canvas');
        miniCanvas.width = 100;
        miniCanvas.height = 100;
        const ctx = miniCanvas.getContext('2d');

        // Dibujar una previsualización simple: foto del usuario y stitch
        fotoUsuario.onload || fotoUsuario.complete
            ? dibujarMiniCollage(ctx, miniCanvas.width, miniCanvas.height, diseño)
            : fotoUsuario.onload = () => dibujarMiniCollage(ctx, miniCanvas.width, miniCanvas.height, diseño);

        label.appendChild(radio);
        label.appendChild(miniCanvas);
        opcionesDiv.appendChild(label);
    });
}

// Función para dibujar miniatura de collage (simplificada)
function dibujarMiniCollage(ctx, w, h, diseño) {
    ctx.clearRect(0, 0, w, h);

    // Ajustar proporciones para miniatura
    // Para simplificar se usa la fotoUsuario escalada proporcionalmente
    const scaleUserW = w * 0.4;
    const scaleUserH = h * 0.8;
    const scaleStitchW = w * 0.3;
    const scaleStitchH = h * 0.8;

    // Según diseño, dibujar user y stitch en mini canvas
    if (diseño.id === 1) {
        ctx.drawImage(fotoUsuario, 0, 0, scaleUserW, scaleUserH);
        ctx.drawImage(stitchImg, scaleUserW + 5, 0, scaleStitchW, scaleStitchH);
    } else if (diseño.id === 2) {
        ctx.drawImage(stitchImg, 0, 0, scaleStitchW, scaleStitchH);
        ctx.drawImage(fotoUsuario, scaleStitchW + 5, 0, scaleUserW, scaleUserH);
    } else if (diseño.id === 3) {
        ctx.drawImage(stitchImg, w * 0.35, 0, scaleStitchW, scaleStitchH * 0.5);
        ctx.drawImage(fotoUsuario, w * 0.1, scaleStitchH * 0.5, scaleUserW * 2, scaleUserH * 0.9);
    } else if (diseño.id === 4) {
        ctx.drawImage(fotoUsuario, w * 0.1, 0, scaleUserW * 2, scaleUserH * 0.9);
        ctx.drawImage(stitchImg, w * 0.35, scaleStitchH * 0.6, scaleStitchW, scaleStitchH * 0.5);
    } else if (diseño.id === 5) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(stitchImg, 0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.drawImage(fotoUsuario, w * 0.15, h * 0.1, w * 0.7, h * 0.8);
    }
}

// Generar collage final al hacer click en Generar
btnGenerar.addEventListener('click', () => {
    if (!diseñoSeleccionado || !fotoUsuario) return;

    // Mostrar canvas
    resultadoDiv.classList.remove('hidden');
    disenosDiv.classList.add('hidden');

    // Ajustar canvas tamaño
    canvas.width = 400;
    canvas.height = 240;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar collage con el diseño seleccionado
    // Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar foto usuario
    const u = diseñoSeleccionado.userPos;
    ctx.drawImage(fotoUsuario, u.x, u.y, u.w, u.h);

    // Dibujar stitch
    const s = diseñoSeleccionado.stitchPos;
    if (s.opacity !== undefined) ctx.globalAlpha = s.opacity;
    ctx.drawImage(stitchImg, s.x, s.y, s.w, s.h);
    ctx.globalAlpha = 1;
});

// Botón continuar, puedes enlazar donde quieras
btnContinuar.addEventListener('click', () => {
    // Guardar la imagen generada en localStorage
    const dataURL = canvas.toDataURL('image/png');
    localStorage.setItem('imagenParaEditar', dataURL);

    // Guardar el diseño seleccionado (opcional)
    localStorage.setItem('diseñoSeleccionado', JSON.stringify(diseñoSeleccionado));

    // Redirigir a la página editor
    window.location.href = "../html/EditarFoto.html";
});


btnRegresar.addEventListener('click', () => {
    // Ocultar resultado
    resultadoDiv.classList.add('hidden');
    // Mostrar sección diseño y subir foto
    disenosDiv.classList.remove('hidden');
    inputFoto.value = ''; // opcional: limpiar input para subir foto nueva si quiere
    btnGenerar.disabled = true;
    diseñoSeleccionado = null;
});

