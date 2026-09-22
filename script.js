/* ==================== CONFIGURACIÓN INICIAL ==================== */
const FECHA_INICIO = new Date('2026-05-25T00:00:00');
const TOTAL_NIVELES = 6;

/* ==================== ESTRELLAS ==================== */
function crearEstrellas() {
  const cantidad = 80;
  for (let i = 0; i < cantidad; i++) {
    const estrella = document.createElement('div');
    estrella.classList.add('estrella');
    const tamaño = Math.random() * 2 + 1;
    estrella.style.width = tamaño + 'px';
    estrella.style.height = tamaño + 'px';
    estrella.style.left = Math.random() * 100 + '%';
    estrella.style.top = Math.random() * 100 + '%';
    estrella.style.animationDelay = Math.random() * 3 + 's';
    estrella.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(estrella);
  }
}

/* ==================== LLUVIA ==================== */
function crearLluvia() {
  const contenedor = document.getElementById('lluvia');
  const cantidad = 40;
  for (let i = 0; i < cantidad; i++) {
    const gota = document.createElement('div');
    gota.classList.add('gota');
    gota.style.left = Math.random() * 100 + '%';
    gota.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
    gota.style.animationDelay = Math.random() * 5 + 's';
    gota.style.opacity = Math.random() * 0.5 + 0.2;
    contenedor.appendChild(gota);
  }
}

/* ==================== NAVEGACIÓN ENTRE PANTALLAS ==================== */
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  const pantalla = document.getElementById(id);
  if (pantalla) {
    pantalla.classList.add('activa');
    window.scrollTo(0, 0);
  }
}

/* ==================== PORTADA ==================== */
document.getElementById('btn-comenzar').addEventListener('click', () => {
  mostrarPantalla('pantalla-pregunta');
});

/* ==================== BOTÓN FUGITIVO ==================== */
const btnNo = document.getElementById('btn-no');
const btnSi = document.getElementById('btn-si');
const mensajeNo = document.getElementById('mensaje-no');
let intentosNo = 0;

const frasesNo = [
  '¿Segura?',
  'Inténtalo de nuevo…',
  'Casi me atrapas.',
  'No puedes decir que no.',
  'Sabes que quieres decir sí.',
  'Ya ríndete, Vale.'
];

btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  intentosNo++;

  // Mover el botón a posición aleatoria
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  btnNo.style.transform = `translate(${x}px, ${y}px)`;

  // Mostrar frase
  if (intentosNo <= frasesNo.length) {
    mensajeNo.textContent = frasesNo[intentosNo - 1];
    mensajeNo.classList.add('visible');
  }

  // Después de 6 intentos, el botón desaparece
  if (intentosNo >= 6) {
    btnNo.style.opacity = '0';
    btnNo.style.pointerEvents = 'none';
    mensajeNo.textContent = 'Sabía que dirías que sí. Siempre lo sabes. 💙';
  }
});

// Para móvil: también se mueve al tocar
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  btnNo.click();
});

btnSi.addEventListener('click', () => {
  mostrarPantalla('pantalla-menu');
  actualizarNiveles();
});

/* ==================== CONTADOR EN VIVO ==================== */
function actualizarContador() {
  const ahora = new Date();
  const diferencia = ahora - FECHA_INICIO;

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  const elDias = document.getElementById('dias');
  const elHoras = document.getElementById('horas');
  const elMinutos = document.getElementById('minutos');
  const elSegundos = document.getElementById('segundos');

  if (elDias) elDias.textContent = dias;
  if (elHoras) elHoras.textContent = horas;
  if (elMinutos) elMinutos.textContent = minutos;
  if (elSegundos) elSegundos.textContent = segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador();

/* ==================== SISTEMA DE NIVELES ==================== */
let nivelesDesbloqueados = parseInt(localStorage.getItem('nivelesDesbloqueados')) || 1;

function actualizarNiveles() {
  document.querySelectorAll('.nivel').forEach(btn => {
    const nivel = parseInt(btn.dataset.nivel);
    if (nivel <= nivelesDesbloqueados) {
      btn.classList.remove('bloqueado');
      btn.classList.add('desbloqueado');
    } else {
      btn.classList.add('bloqueado');
      btn.classList.remove('desbloqueado');
    }
  });
}

function desbloquearNivel(nivel) {
  if (nivel > nivelesDesbloqueados) {
    nivelesDesbloqueados = nivel;
    localStorage.setItem('nivelesDesbloqueados', nivelesDesbloqueados);
    actualizarNiveles();
  }
}

// Click en cada nivel del menú
document.querySelectorAll('.nivel').forEach(btn => {
  btn.addEventListener('click', () => {
    const nivel = parseInt(btn.dataset.nivel);
    if (nivel <= nivelesDesbloqueados) {
      mostrarPantalla('nivel-' + nivel);
    }
  });
});

/* ==================== BOTONES SIGUIENTE NIVEL ==================== */
document.querySelectorAll('.btn-siguiente-nivel').forEach(btn => {
  btn.addEventListener('click', () => {
    const siguiente = parseInt(btn.dataset.siguiente);
    desbloquearNivel(siguiente);
    mostrarPantalla('nivel-' + siguiente);
  });
});

/* ==================== NIVEL 1: MINIJUEGO LLAMADAS ==================== */
document.querySelectorAll('#nivel-1 .opcion').forEach(opcion => {
  opcion.addEventListener('click', () => {
    const esCorrecta = opcion.dataset.correcta === 'true';
    const feedback = document.getElementById('feedback-nivel-1');
    const btnSiguiente = document.querySelector('#nivel-1 .btn-siguiente-nivel');

    if (esCorrecta) {
      opcion.classList.add('correcta');
      feedback.textContent = '¡Exacto! Esa llamada fue eterna. 💙';
      feedback.style.color = '#6ba8e5';
      btnSiguiente.disabled = false;
    } else {
      opcion.classList.add('incorrecta');
      feedback.textContent = 'No… fue más larga todavía. Intenta otra vez.';
      feedback.style.color = '#e88a8a';
    }
  });
});

// Animación de números en las estadísticas
function animarNumero(id, valorFinal, duracion = 1500) {
  const el = document.getElementById(id);
  if (!el) return;
  let inicio = 0;
  const paso = valorFinal / (duracion / 16);
  const intervalo = setInterval(() => {
    inicio += paso;
    if (inicio >= valorFinal) {
      inicio = valorFinal;
      clearInterval(intervalo);
    }
    el.textContent = Math.floor(inicio);
  }, 16);
}

// Cuando se abre el nivel 1, animar los números
const observerNivel1 = new MutationObserver(() => {
  if (document.getElementById('nivel-1').classList.contains('activa')) {
    animarNumero('total-llamadas', 132);
    animarNumero('total-horas', 81);
    animarNumero('llamada-mas-larga', 526);
  }
});
observerNivel1.observe(document.getElementById('nivel-1'), { attributes: true });

/* ==================== NIVEL 5: PALABRAS ==================== */
const frases = [
  'Desde que llegaste, todo tiene más color.',
  'Contigo hasta el silencio se siente bonito.',
  'Eres mi lugar favorito en el mundo.',
  'No sé qué hice para merecerte, pero lo haría mil veces.',
  'Cada día contigo es mi día favorito.',
  'Si volviera a nacer, te buscaría otra vez.',
  'Eres mi persona, Val. Siempre.',
  'Gracias por quedarte incluso cuando no era fácil.',
  'No eres una parte de mi vida. Eres la razón por la que la vida me gusta',
  'Te amo más de lo que las palabras pueden decir.',
  'Eres mi hogar, mi refugio y mi alegría.',
  'Cada momento contigo es un tesoro que guardo en mi corazón.',
  'No importa cuán lejos estemos, siempre te llevo conmigo.',
  'Eres la mejor parte de mí, Valentina.',
  'Gracias por ser tú, por ser mi todo.',
  'Eres mi luz en medio de la oscuridad.',
  'Cada suspiro tuyo es un milagro que me llena de alegría.',
  'Te quiero con todo mi corazón, Valentina.',
  'Eres el sueño que nunca quiero despertar.',
  'Contigo, cada día es un regalo.',
  'Gracias por hacerme feliz, por ser mi apoyo y mi refugio.',
  'Eres mi amor, mi amiga y mi todo.',
  'Te amo con todo lo que soy, Valentina.'
];

let indiceFrase = 0;
const contenedorPalabras = document.getElementById('contenedor-palabras');

function mostrarSiguienteFrase() {
  if (indiceFrase >= frases.length) {
    // Ya no hay más frases: activar botón siguiente
    const btn = document.querySelector('#nivel-5 .btn-siguiente-nivel');
    if (btn) btn.disabled = false;
    contenedorPalabras.innerHTML = '<p class="frase-revelada">Eso es todo por ahora… pero hay más. 💙</p>';
    return;
  }

  const p = document.createElement('p');
  p.classList.add('frase-revelada');
  p.textContent = frases[indiceFrase];
  contenedorPalabras.innerHTML = '';
  contenedorPalabras.appendChild(p);
  indiceFrase++;

  // Si ya mostró todas, activar botón
  if (indiceFrase >= frases.length) {
    const btn = document.querySelector('#nivel-5 .btn-siguiente-nivel');
    if (btn) btn.disabled = false;
  }
}

// Tocar la pantalla del nivel 5 para revelar frases
document.getElementById('nivel-5').addEventListener('click', (e) => {
  if (e.target.closest('.btn-siguiente-nivel')) return;
  mostrarSiguienteFrase();
});

// Iniciar con la primera frase al entrar
const observerNivel5 = new MutationObserver(() => {
  if (document.getElementById('nivel-5').classList.contains('activa') && indiceFrase === 0) {
    mostrarSiguienteFrase();
  }
});
observerNivel5.observe(document.getElementById('nivel-5'), { attributes: true });

/* ==================== NIVEL 6: CARTA FINAL ==================== */
const sobre = document.getElementById('sobre');
const carta = document.getElementById('carta');
const textoCarta = document.getElementById('texto-carta');
const btnFinal = document.getElementById('btn-final');

const contenidoCarta = `Val:

No sé muy bien cómo empezar esto, porque ya te dije muchas cosas en el video.

Además, no quiero que esto se sienta como un discurso, sino como algo que te escribo desde el corazón.

Quiero que sepas que cada momento contigo ha sido un regalo. Desde nuestras llamadas interminables hasta los silencios cómodos, cada instante a tu lado es especial.

No quiero que esto sea solo un recuerdo, sino una promesa de que siempre estaré aquí para ti, apoyándote, riendo contigo y compartiendo cada paso del camino.

Una promesa que nunca se romperá, porque lo que siento por ti es más fuerte que cualquier obstáculo.

Que sin importar la distancia, el tiempo o las circunstancias, siempre te llevaré en mi corazón.

Sí, sé que a veces callo muchas cosas, que no siempre expreso lo que quiero decir, pero quiero que sepas que cada palabra que no digo, cada silencio, está lleno de amor por ti.

Que siempre me inclino hacia ti, que siempre busco tu felicidad, aunque a veces pareciera que lo hago sobre la mia, pero quiero que sepas que cada día contigo es un día que quiero repetir una y otra vez.

No sé como demostrarte todo lo que siento. No sé como demostrarte todo lo que significas para mí. No sé como demostrarte lo valioso que eres para mí. No sé como demostrarte lo mucho que te amo.

Sé que estas tal vez sean palabras que no tienen ni un poquito de peso, que sean solo palabras vacías, sin sentido pero quiero que sepas que cada palabra que te digo, cada palabra que te escribo, está llena de amor por ti.

Te amo, Valentina. Siempre te he amado y siempre lo haré 💙💜`;

sobre.addEventListener('click', () => {
  sobre.classList.add('oculto');
  carta.classList.remove('oculto');
  escribirCarta();
});

function escribirCarta() {
  let i = 0;
  textoCarta.textContent = '';
  const velocidad = 30; // ms por carácter

  const intervalo = setInterval(() => {
    if (i < contenidoCarta.length) {
      textoCarta.textContent += contenidoCarta.charAt(i);
      i++;
    } else {
      clearInterval(intervalo);
      btnFinal.classList.remove('oculto');
    }
  }, velocidad);
}

btnFinal.addEventListener('click', () => {
  mostrarPantalla('pantalla-final');
  lanzarCorazones();
});

/* ==================== CORAZONES FINALES ==================== */
function lanzarCorazones() {
  const emojis = ['💙', '💜', '⭐', '🌙', '✨'];
  setInterval(() => {
    const corazon = document.createElement('div');
    corazon.classList.add('corazon');
    corazon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    corazon.style.left = Math.random() * 100 + '%';
    corazon.style.bottom = '-50px';
    corazon.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(corazon);

    setTimeout(() => corazon.remove(), 5000);
  }, 300);
}

/* ==================== INICIALIZACIÓN ==================== */
crearEstrellas();
crearLluvia();
actualizarNiveles();

/* ==================== NIVEL 4: BLOQUEO POR VIDEOS VISTOS ==================== */
const TOTAL_VIDEOS = 6;
let videosVistos = new Set();

function actualizarProgresoVideos() {
  const progreso = document.getElementById('progreso-videos');
  const btnSiguiente = document.querySelector('#nivel-4 .btn-siguiente-nivel');
  
  if (!progreso || !btnSiguiente) return;

  progreso.textContent = `Videos vistos: ${videosVistos.size} / ${TOTAL_VIDEOS}`;

  if (videosVistos.size >= TOTAL_VIDEOS) {
    btnSiguiente.disabled = false;
    btnSiguiente.textContent = 'Desbloquear Nivel 5 →';
    progreso.textContent = '¡Los viste todos! Nivel 5 desbloqueado 💙';
    progreso.style.color = '#6ba8e5';
  } else {
    btnSiguiente.disabled = true;
    const faltan = TOTAL_VIDEOS - videosVistos.size;
    btnSiguiente.textContent = `Faltan ${faltan} video${faltan > 1 ? 's' : ''} por ver`;
  }
}

// Detectar cuando cada video llega al final
document.querySelectorAll('#nivel-4 .video-item').forEach(video => {
  video.addEventListener('ended', () => {
    const numVideo = video.dataset.video;
    if (numVideo) {
      videosVistos.add(numVideo);
      actualizarProgresoVideos();
    }
  });
});

// Inicializar el progreso al cargar
actualizarProgresoVideos();