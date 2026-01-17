const materias = [
  {
    nombre: "Cálculo Integral",
    dias: {
      lunes: "12:00 - 13:00 · LAB TELEM",
      miercoles: "11:00 - 13:00 · LAB TELEM",
      jueves: "15:00 - 17:00 · G1"
    }
  },
  {
    nombre: "Álgebra Lineal",
    dias: {
      lunes: "13:00 - 15:00 · LAB TELEM",
      miercoles: "13:00 - 15:00 · LAB TELEM",
      jueves: "12:00 - 13:00 · G1"
    }
  },
  {
    nombre: "Química",
    dias: {
      lunes: "15:00 - 17:00 · G1",
      martes: "13:00 - 14:00 · G1",
      viernes: "16:00 - 17:00 · G1"
    }
  },
  {
    nombre: "Probabilidad y Estadística",
    dias: {
      lunes: "17:00 - 19:00 · G1",
      martes: "16:00 - 17:00 · G1",
      viernes: "17:00 - 19:00 · G1"
    }
  },
  {
    nombre: "Programación Orientada a Objetos",
    dias: {
      martes: "14:00 - 16:00 · G1",
      jueves: "13:00 - 15:00 · G1",
      viernes: "15:00 - 16:00 · G1"
    }
  },
  {
    nombre: "Contabilidad Financiera",
    dias: {
      miercoles: "15:00 - 17:00 · G1",
      jueves: "17:00 - 19:00 · G1"
    }
  },
  {
    nombre: "Tutoría 02",
    dias: {
      viernes: "13:00 - 15:00 · G1"
    }
  }
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

const diaSelect = document.getElementById("diaSelect");

diaSelect.addEventListener("change", () => {
  mostrarMateriasPorDia(diaSelect.value);
});

function mostrarMateriasPorDia(dia) {
  horario.innerHTML = "";

  materias.forEach(materia => {
    if (materia.dias[dia]) {
      const card = document.createElement("div");
      card.classList.add("materia");

      card.innerHTML = `
        <h2>${materia.nombre}</h2>
        <p>${materia.dias[dia]}</p>
      `;

      card.addEventListener("click", () => {
        abrirMateria(materia.nombre);
      });

      horario.appendChild(card);
    }
  });
}

mostrarMateriasPorDia("lunes");

