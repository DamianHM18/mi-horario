const materias = [
  {
    nombre: "Cálculo Integral",
    color: "#1e3799",
    dias: {
      lunes: "12:00 - 13:00 · LAB TELEM",
      miercoles: "11:00 - 13:00 · LAB TELEM",
      jueves: "15:00 - 17:00 · G1"
    }
  },
  {
    nombre: "Álgebra Lineal",
    color: "#74b9ff",
    dias: {
      lunes: "13:00 - 15:00 · LAB TELEM",
      miercoles: "13:00 - 15:00 · LAB TELEM",
      jueves: "12:00 - 13:00 · G1"
    }
  },
  {
    nombre: "Química",
    color: "#27ae60",
    dias: {
      lunes: "15:00 - 17:00 · G1",
      martes: "13:00 - 14:00 · G1",
      viernes: "16:00 - 17:00 · G1"
    }
  },
  {
    nombre: "Probabilidad y Estadística",
    color: "#f39c12",
    dias: {
      lunes: "17:00 - 19:00 · G1",
      martes: "16:00 - 17:00 · G1",
      viernes: "17:00 - 19:00 · G1"
    }
  },
  {
    nombre: "Programación Orientada a Objetos",
    color: "#e74c3c",
    dias: {
      martes: "14:00 - 16:00 · G1",
      jueves: "13:00 - 15:00 · G1",
      viernes: "15:00 - 16:00 · G1"
    }
  },
  {
    nombre: "Contabilidad Financiera",
    color: "#e84393",
    dias: {
      miercoles: "15:00 - 17:00 · G1",
      jueves: "17:00 - 19:00 · G1"
    }
  },
  {
    nombre: "Tutoría 02",
    color: "#74b9ff",
    dias: {
      viernes: "13:00 - 15:00 · G1"
    }
  },
  {
  nombre: "Guitarra y Rondalla",
    color: "#f39c12",
  dias: {
    viernes: "Horario por definir · G1"
  }
}

];



let materiaActual = "";

const inputTarea = document.getElementById("nuevaTarea");
const btnAgregar = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("listaTareas");

const horario = document.getElementById("horario");


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

  // 1. Filtrar materias del día
  const materiasDelDia = materias
    .filter(materia => materia.dias[dia])
   .map(materia => {
  const textoHorario = materia.dias[dia];
  const horaInicio = textoHorario.split(" - ")[0];

  return {
    nombre: materia.nombre,
    horario: textoHorario,
    horaInicio: convertirAHora(horaInicio),
    color: materia.color   // 👈 ESTO FALTABA
  };
});

  // 2. Ordenar por hora
  materiasDelDia.sort((a, b) => a.horaInicio - b.horaInicio);

  // 3. Pintar tarjetas ordenadas
materiasDelDia.forEach(materia => {
  const card = document.createElement("div");
  card.classList.add("materia");

  card.style.background = `
    linear-gradient(
      135deg,
      ${materia.color}cc,
      ${materia.color}66
    )
  `;

  card.innerHTML = `
    <h2>${materia.nombre}</h2>
    <p>${materia.horario}</p>
  `;

  card.addEventListener("click", () => {
    abrirMateria(materia.nombre);
  });

  horario.appendChild(card);
});

}

mostrarMateriasPorDia("lunes");

function convertirAHora(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

const tablaBody = document.getElementById("tablaBody");

const horasTabla = [
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00"
];

const diasTabla = ["lunes", "martes", "miercoles", "jueves", "viernes"];

function generarTablaSemanal() {
  tablaBody.innerHTML = "";

  const filasOcupadas = {};

  horasTabla.forEach((hora, indexHora) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${hora}</td>`;

    diasTabla.forEach(dia => {

      // Si esta celda ya está ocupada por un rowspan
      if (filasOcupadas[`${dia}-${indexHora}`]) {
        return;
      }

      let celdaCreada = false;

      materias.forEach(materia => {
        const horario = materia.dias[dia];
        if (!horario) return;

        const [inicio, fin] = horario.split(" · ")[0].split(" - ");

        if (inicio === hora.split(" ")[0]) {
          const duracionHoras =
            convertirAHora(fin) - convertirAHora(inicio);

          const rowspan = duracionHoras / 60;

          const td = document.createElement("td");
          td.rowSpan = rowspan;

          td.innerHTML = `
            <div class="bloque" style="background:${materia.color}">
              <strong>${materia.nombre}</strong><br>
              <small>${horario.split(" · ")[1]}</small>
            </div>
          `;

          tr.appendChild(td);
          celdaCreada = true;

          // Marcar filas ocupadas
          for (let i = 1; i < rowspan; i++) {
            filasOcupadas[`${dia}-${indexHora + i}`] = true;
          }
        }
      });

      if (!celdaCreada) {
        tr.innerHTML += `<td></td>`;
      }
    });

    tablaBody.appendChild(tr);
  });
}

generarTablaSemanal();



