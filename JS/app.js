const materias = [
  { id: "mate", nombre: "Matemáticas", hora: "7:00 - 8:00" },
  { id: "esp", nombre: "Español", hora: "8:00 - 9:00" },
  { id: "ing", nombre: "Inglés", hora: "9:00 - 10:00" },
  { id: "hist", nombre: "Historia", hora: "10:30 - 11:30" }
];

let materiaActual = "";

const inputTarea = document.getElementById("nuevaTarea");
const btnAgregar = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("listaTareas");

const horario = document.getElementById("horario");

materias.forEach(materia => {
  const card = document.createElement("div");
  card.classList.add("materia");

  card.innerHTML = `
    <h2>${materia.nombre}</h2>
    <p>${materia.hora}</p>
  `;

  card.addEventListener("click", () => {
  abrirMateria(materia.nombre);
});


  horario.appendChild(card);
});

const vistaMateria = document.getElementById("vistaMateria");
const tituloMateria = document.getElementById("tituloMateria");
const btnVolver = document.getElementById("btnVolver");

function abrirMateria(nombre) {
  materiaActual = nombre;
  tituloMateria.textContent = nombre;
  vistaMateria.classList.remove("oculto");
  cargarTareas();
}


btnVolver.addEventListener("click", () => {
  vistaMateria.classList.add("oculto");
});

function cargarTareas() {
  listaTareas.innerHTML = "";
  const tareas = JSON.parse(localStorage.getItem(materiaActual)) || [];

  tareas.forEach((tarea, index) => {
    const li = document.createElement("li");
    li.className = "tarea";
    if (tarea.hecha) li.classList.add("hecha");

    li.innerHTML = `
      <span>${tarea.texto}</span>
      <input type="checkbox" ${tarea.hecha ? "checked" : ""}>
    `;

    li.querySelector("input").addEventListener("change", () => {
      tarea.hecha = !tarea.hecha;
      tareas[index] = tarea;
      localStorage.setItem(materiaActual, JSON.stringify(tareas));
      cargarTareas();
    });

    listaTareas.appendChild(li);
  });
}

btnAgregar.addEventListener("click", () => {
  if (inputTarea.value.trim() === "") return;

  const tareas = JSON.parse(localStorage.getItem(materiaActual)) || [];

  tareas.push({
    texto: inputTarea.value,
    hecha: false
  });

  localStorage.setItem(materiaActual, JSON.stringify(tareas));
  inputTarea.value = "";
  cargarTareas();
});

if ("Notification" in window) {
  Notification.requestPermission();
}


function mostrarNotificacion(titulo, mensaje) {
  if (Notification.permission === "granted") {
    new Notification(titulo, {
      body: mensaje,
      icon: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
    });
  }
}

setTimeout(() => {
  mostrarNotificacion("📚 Recordatorio", "Tienes tareas pendientes");
}, 3000);
