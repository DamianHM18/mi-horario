const materias = [
  {
    nombre: "Cálculo Integral",
    color: "#1e3799",
    dias: {
      lunes: "12:00 - 13:00 · SALA DE APLICACIONES I",
      miercoles: "11:00 - 13:00 · H6",
      jueves: "15:00 - 17:00 · G1"
    }
  },
  {
    nombre: "Álgebra Lineal",
    color: "#74b9ff",
    dias: {
      lunes: "13:00 - 16:00 · G5",
      miercoles: "13:00 - 15:00 · SALA DE APLICACIONES I",
    }
  },
  {
    nombre: "Química",
    color: "#27ae60",
    dias: {
      lunes: "16:00 - 17:00 · G1",
      martes: "13:00 - 14:00 · G1",
      viernes: "15:00 - 17:00 · G1"
    }
  },
  {
    nombre: "Probabilidad y Estadística",
    color: "#f39c12",
    dias: {
      lunes: "17:00 - 19:00 · G1",
      jueves: "12:00 - 13:00 · G1",
      viernes: "17:00 - 19:00 · G1"
    }
  },
  {
    nombre: "Programación Orientada a Objetos",
    color: "#e74c3c",
    dias: {
      martes: "14:00 - 15:00 · G1",
      jueves: "13:00 - 15:00 · G1",
      viernes: "13:00 - 15:00 · G1"
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
      martes: "15:00 - 17:00 · G1"
    }
  },
  {
  nombre: "Guitarra y Rondalla",
    color: "#f39c12",
    dias: {
    miercoles: "09:00 - 11:00 · AULA DE MÚSICA"
  }
},
{
  nombre: "Inglés Nivel 1",
  color: "#e84393",
  dias:{
    sabado: "08:00 - 13:00 · H11"
  }
}

];



let materiaActual = "";

const inputTarea = document.getElementById("nuevaTarea");
const btnAgregar = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("listaTareas");
const btnLimpiar = document.getElementById("btnLimpiar");

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
  tareas.sort((a, b) => a.hecha - b.hecha);


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
  mostrarMateriasPorDia(diaSelect.value);
});

btnLimpiar.addEventListener("click", () => {
  if (!materiaActual) return;

  let tareas = JSON.parse(localStorage.getItem(materiaActual)) || [];

  // Quitar solo las tareas hechas
  tareas = tareas.filter(t => !t.hecha);

  localStorage.setItem(materiaActual, JSON.stringify(tareas));

  cargarTareas();
  mostrarMateriasPorDia(diaSelect.value);
});


const diaSelect = document.getElementById("diaSelect");

diaSelect.addEventListener("change", () => {
  mostrarMateriasPorDia(diaSelect.value);
});

function mostrarMateriasPorDia(dia) {
  horario.classList.remove("animar-dia");
void horario.offsetWidth; // truco para reiniciar animación
horario.classList.add("animar-dia");

  
  
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
    color: materia.color   
  };
});

  // 2. Ordenar por hora
  materiasDelDia.sort((a, b) => a.horaInicio - b.horaInicio);

  // 3. Pintar tarjetas ordenadas
materiasDelDia.forEach(materia => {
  const card = document.createElement("div");
  card.classList.add("materia");

  // BURBUJA DE TAREAS PENDIENTES
const pendientes = contarPendientes(materia.nombre);
if (pendientes > 0) {
  const burbuja = document.createElement("div");
  burbuja.classList.add("burbuja");
  burbuja.textContent = pendientes;
  card.appendChild(burbuja);
}

  
  card.style.background = `
    linear-gradient(
      135deg,
      ${materia.color}cc,
      ${materia.color}66
    )
  `;

  card.innerHTML += `
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
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00"
];

const diasTabla = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

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

function contarPendientes(nombreMateria) {
  const tareas = JSON.parse(localStorage.getItem(nombreMateria)) || [];
  return tareas.filter(t => !t.hecha).length;
}














