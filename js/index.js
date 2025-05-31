const btnComenzar = document.getElementById('btnComenzar');
const pantallaInicio = document.getElementById('pantallaInicio');
const pantallaSiguiente = document.getElementById('pantallaSiguiente');

btnComenzar.addEventListener('click', () => {
  pantallaInicio.classList.add('desaparecer');

  setTimeout(() => {
    pantallaInicio.style.display = 'none';
    pantallaSiguiente.classList.remove('oculto');

    // Esperar 3 segundos y redirigir
    setTimeout(() => {
      window.location.href = '/html/MenuPrincipal.html'; 
      // Cambia esto si tu archivo tiene otro nombre
    }, 5000);
  }, 1000); // esperar 1 segundo por la transición antes de mostrar la imagen
});
