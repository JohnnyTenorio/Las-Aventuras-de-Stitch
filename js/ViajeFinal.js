// Cargar nombre desde localStorage
const nombre = localStorage.getItem('nombreUsuario') || 'Señor o Señorita';
document.getElementById('nombreUsuario').textContent = nombre;

const btnFinalizar = document.getElementById('btnFinalizar');
const stitchTransition = document.getElementById('stitchTransition');
const countdownElem = document.getElementById('countdown');

btnFinalizar.addEventListener('click', () => {
  // Mostrar transición
  stitchTransition.style.display = 'flex';

  // Ocultar contenido principal
  document.querySelector('.container').style.display = 'none';

  let tiempo = 10;
  countdownElem.textContent = tiempo;

  const intervalo = setInterval(() => {
    tiempo--;
    if (tiempo > 0) {
      countdownElem.textContent = tiempo;
    } else {
      clearInterval(intervalo);
      window.location.href = '../index.html';
    }
  }, 1000);
});
