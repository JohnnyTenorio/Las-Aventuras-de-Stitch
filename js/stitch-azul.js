const btnAzul = document.getElementById('btnAzul');

btnAzul.addEventListener('click', () => {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  overlay.innerHTML = `
    <div id="contenedorForm" class="contenedor-transicion">
      <img src="../img/stitch_800x600_7c896288.png" class="imagen-stitch" />
      <h2>¡Felicidades, elegiste a Stitch Azul!</h2>
      <p>Antes de comenzar, coloca tus nombres:</p>
      <input type="text" id="nombreUsuario" placeholder="Tus nombres aquí..." />
      <button id="btnAceptar">Aceptar</button>
      <p id="contador"></p>
    </div>
  `;

  document.body.appendChild(overlay);

document.getElementById('btnAceptar').addEventListener('click', () => {
  const nombre = document.getElementById('nombreUsuario').value.trim();
  if (nombre === '') {
    alert('Por favor, escribe tus nombres antes de continuar.');
    return;
  }

  // Guardar el nombre en localStorage
  localStorage.setItem('nombreUsuario', nombre);

  const contenedorForm = document.getElementById('contenedorForm');
  const contadorParrafo = document.getElementById('contador');

  let segundos = 10;
  contadorParrafo.textContent = `Tu aventura comenzará en ${segundos} segundos...`;

  const intervalo = setInterval(() => {
    segundos--;
    contadorParrafo.textContent = `Tu aventura comenzará en ${segundos} segundos...`;

    if (segundos === 0) {
      clearInterval(intervalo);

      // Limpiar todo el contenido actual del contenedor
      contenedorForm.innerHTML = `
        <img src="../img/stitch_800x600_7c896288.png" alt="Stitch Azul" class="imagen-stitch-final"/>
        <h2 class="mensaje-final">¡Prepárate, comienza tu aventura!</h2>
      `;

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = '../html/MenuStitch.html';
      }, 4000);
    }
  }, 1000);
  });
});

const btnRosado = document.getElementById('btnRosado');

btnRosado.addEventListener('click', () => {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  overlay.innerHTML = `
    <div id="contenedorFormRosado" class="contenedor-transicion">
      <h2>¡Elegiste la Stitch Rosada pero!</h2>
      <img src="../img/624-Angel.webp" alt="Stitch Rosado" class="imagen-stitch" />
      <p>nahh no te gusta mucho la rosada</p>
      <button id="btnRegresar">Regresar</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const btnRegresar = document.getElementById('btnRegresar');
  btnRegresar.addEventListener('click', () => {
    const contenedor = document.getElementById('contenedorFormRosado');

    let segundos = 5;
    contenedor.innerHTML = `
      <div class="transicion">
        <h2>Regresando en <span id="contadorRegreso">${segundos}</span>...</h2>
      </div>
    `;

    const contadorSpan = document.getElementById('contadorRegreso');

    const intervalo = setInterval(() => {
      segundos--;
      contadorSpan.textContent = segundos;

      if (segundos <= 0) {
        clearInterval(intervalo);
        document.body.removeChild(overlay);
      }
    }, 1000);
  });
});
