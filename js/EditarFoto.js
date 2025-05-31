const canvas = document.getElementById('canvasEditor');
const ctx = canvas.getContext('2d');

const inputTexto = document.getElementById('inputTexto');
const inputColor = document.getElementById('inputColor');
const inputTamaño = document.getElementById('inputTamaño');
const btnAgregarTexto = document.getElementById('btnAgregarTexto');
const btnDescargar = document.getElementById('btnDescargar');
const textListDiv = document.getElementById('textList');

let backgroundImg = new Image();
let textos = [];
let seleccionado = null;
let arrastrando = false;
let offsetX, offsetY;

// Cargar imagen guardada en localStorage
const dataURL = localStorage.getItem('imagenParaEditar');
if (!dataURL) {
    alert('No se encontró imagen para editar.');
    // Podrías redirigir a la página anterior si quieres:
    // window.location.href = "FotoDeRecuerdo.html";
} else {
    backgroundImg.src = dataURL;
}

backgroundImg.onload = () => {
    canvas.width = backgroundImg.width;
    canvas.height = backgroundImg.height;
    dibujarCanvas();
};

function dibujarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0);

    textos.forEach(t => {
        ctx.font = `${t.size}px Arial`;
        ctx.fillStyle = t.color;
        ctx.textBaseline = 'top';
        ctx.fillText(t.text, t.x, t.y);

        if (t === seleccionado) {
            const ancho = ctx.measureText(t.text).width;
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.strokeRect(t.x - 2, t.y - 2, ancho + 4, t.size + 4);
        }
    });
}

btnAgregarTexto.addEventListener('click', () => {
    const texto = inputTexto.value.trim();
    if (!texto) return alert('Ingresa un texto válido');
    const nuevoTexto = {
        text: texto,
        x: 50,
        y: 50,
        color: inputColor.value,
        size: parseInt(inputTamaño.value),
    };
    textos.push(nuevoTexto);
    seleccionado = nuevoTexto;
    actualizarListaTextos();
    dibujarCanvas();
    inputTexto.value = '';
});

function actualizarListaTextos() {
    textListDiv.innerHTML = '';
    textos.forEach((t) => {
        const div = document.createElement('div');
        div.textContent = t.text;
        div.classList.toggle('selected', t === seleccionado);
        div.addEventListener('click', () => {
            seleccionado = t;
            inputTexto.value = t.text;
            inputColor.value = t.color;
            inputTamaño.value = t.size;
            actualizarListaTextos();
            dibujarCanvas();
        });
        textListDiv.appendChild(div);
    });
}

canvas.addEventListener('mousedown', (e) => {
    if (!seleccionado) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    ctx.font = `${seleccionado.size}px Arial`;
    const ancho = ctx.measureText(seleccionado.text).width;
    const alto = seleccionado.size;

    if (
        mouseX >= seleccionado.x &&
        mouseX <= seleccionado.x + ancho &&
        mouseY >= seleccionado.y &&
        mouseY <= seleccionado.y + alto
    ) {
        arrastrando = true;
        offsetX = mouseX - seleccionado.x;
        offsetY = mouseY - seleccionado.y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    seleccionado.x = mouseX - offsetX;
    seleccionado.y = mouseY - offsetY;
    dibujarCanvas();
});

canvas.addEventListener('mouseup', () => {
    arrastrando = false;
});

canvas.addEventListener('mouseleave', () => {
    arrastrando = false;
});

// Actualizar texto seleccionado con inputs
inputTexto.addEventListener('input', () => {
    if (!seleccionado) return;
    seleccionado.text = inputTexto.value;
    actualizarListaTextos();
    dibujarCanvas();
});

inputColor.addEventListener('input', () => {
    if (!seleccionado) return;
    seleccionado.color = inputColor.value;
    dibujarCanvas();
});

inputTamaño.addEventListener('input', () => {
    if (!seleccionado) return;
    seleccionado.size = parseInt(inputTamaño.value);
    dibujarCanvas();
});

btnDescargar.addEventListener('click', () => {
    const enlace = document.createElement('a');
    enlace.download = 'foto_de_recuerdo_editada.png';
    enlace.href = canvas.toDataURL('image/png');
    enlace.click();

    // Esperar 1 segundo antes de mostrar transición y empezar cuenta
    setTimeout(() => {
        document.getElementById('stitchTransition').style.display = 'flex';
        document.querySelector('.controls').style.display = 'none';
        document.getElementById('canvasEditor').style.display = 'none';

        let tiempo = 15;
        const countdownElem = document.getElementById('countdown');
        countdownElem.textContent = tiempo;

        const intervalo = setInterval(() => {
            tiempo--;
            if (tiempo > 0) {
                countdownElem.textContent = tiempo;
            } else {
                clearInterval(intervalo);
                window.location.href = '../html/ViajeFinalizado.html';
            }
        }, 1000);
    }, 1000); // 1 segundo de delay para "dar tiempo a la descarga"
});

