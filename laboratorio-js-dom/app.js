const { animate, stagger, createTimeline } = anime;

const estudiantesRegistrados = [];
let contadorEstudiantes = 0;
let editandoIndex = null;

const btnAgregar = document.getElementById("btnAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiarBusqueda = document.getElementById("btnLimpiarBusqueda");
const btnFiltrar = document.getElementById("btnFiltrar");
const btnVerJSON = document.getElementById("btnVerJSON");

btnAgregar.addEventListener("click", agregarEstudiante);
btnLimpiar.addEventListener("click", limpiarTabla);
btnBuscar.addEventListener("click", buscarEstudiantes);
btnLimpiarBusqueda.addEventListener("click", limpiarBusqueda);
btnFiltrar.addEventListener("click", filtrarPorCarrera);
btnVerJSON.addEventListener("click", mostrarModalJSONGeneral);

animate("#mainCard", {
  opacity: [0, 1],
  translateY: [40, 0],
  duration: 700,
  ease: "outExpo",
});

function agregarEstudiante() {
  const estudiante = obtenerDatosFormulario();

  if (!validarEstudiante(estudiante)) {
    mostrarToast("Debe completar todos los campos.", "warning");
    animate("#btnAgregar", {
      translateX: [0, -6, 6, -4, 4, -2, 0],
      duration: 400,
      ease: "easeInOutCubic",
    });
    return;
  }

  if (editandoIndex !== null) {
    estudiantesRegistrados[editandoIndex] = estudiante;
    editandoIndex = null;
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i>Agregar estudiante';
    btnAgregar.classList.remove("btn-warning-custom");
    btnAgregar.classList.add("btn-accent");
    mostrarToast("Estudiante editado correctamente.", "info");
  } else {
    contadorEstudiantes++;
    estudiante.id = contadorEstudiantes;
    estudiantesRegistrados.push(estudiante);
    mostrarToast("Estudiante agregado correctamente.", "success");
  }

  renderizarTabla(estudiantesRegistrados);
  actualizarTotal();
  limpiarFormulario();
}

function obtenerDatosFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const carrera = document.getElementById("carrera").value;
  const semestre = document.getElementById("semestre").value;
  return { nombre, carrera, semestre };
}

function validarEstudiante(estudiante) {
  return estudiante.nombre !== "" && estudiante.carrera !== "" && estudiante.semestre !== "";
}

function renderizarTabla(lista) {
  const cuerpoTabla = document.getElementById("cuerpoTabla");
  cuerpoTabla.innerHTML = "";

  if (lista.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 5;
    emptyCell.innerHTML = '<div class="empty-state"><i class="fas fa-inbox d-block"></i><span>No hay estudiantes registrados</span></div>';
    emptyRow.appendChild(emptyCell);
    cuerpoTabla.appendChild(emptyRow);
    return;
  }

  lista.forEach((estudiante, index) => {
    const fila = document.createElement("tr");
    fila.classList.add("animate-in");

    const columnaNumero = document.createElement("td");
    columnaNumero.textContent = index + 1;

    const columnaNombre = document.createElement("td");
    columnaNombre.innerHTML = '<strong>' + estudiante.nombre + '</strong>';

    const columnaCarrera = document.createElement("td");
    columnaCarrera.innerHTML = '<span class="badge-campus">' + estudiante.carrera + '</span>';

    const columnaSemestre = document.createElement("td");
    columnaSemestre.textContent = estudiante.semestre;

    const columnaAcciones = document.createElement("td");

    const btnVerJSON = document.createElement("button");
    btnVerJSON.innerHTML = '<i class="fas fa-code"></i>';
    btnVerJSON.className = "action-btn action-btn-json me-1";
    btnVerJSON.title = "Ver JSON";
    btnVerJSON.addEventListener("click", function () {
      mostrarModalJSONIndividual(estudiante);
    });

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = '<i class="fas fa-pen"></i>';
    btnEditar.className = "action-btn action-btn-edit me-1";
    btnEditar.title = "Editar";
    btnEditar.addEventListener("click", function () {
      editarEstudiante(index);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
    btnEliminar.className = "action-btn action-btn-delete";
    btnEliminar.title = "Eliminar";
    btnEliminar.addEventListener("click", function () {
      eliminarEstudiante(index);
    });

    columnaAcciones.appendChild(btnVerJSON);
    columnaAcciones.appendChild(btnEditar);
    columnaAcciones.appendChild(btnEliminar);

    fila.appendChild(columnaNumero);
    fila.appendChild(columnaNombre);
    fila.appendChild(columnaCarrera);
    fila.appendChild(columnaSemestre);
    fila.appendChild(columnaAcciones);

    cuerpoTabla.appendChild(fila);
  });

  const filas = cuerpoTabla.querySelectorAll("tr.animate-in");
  animate(filas, {
    opacity: [0, 1],
    translateX: [-15, 0],
    duration: 350,
    delay: stagger(60),
    ease: "outQuad",
  });
}

function actualizarTotal() {
  const totalEl = document.getElementById("totalEstudiantes");
  const valorActual = parseInt(totalEl.textContent) || 0;
  const valorFinal = estudiantesRegistrados.length;

  animate(
    { val: valorActual },
    {
      val: valorFinal,
      duration: 500,
      ease: "outExpo",
      onUpdate: function (el) {
        totalEl.textContent = Math.round(el.val);
      },
    }
  );
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("carrera").value = "";
  document.getElementById("semestre").value = "";
}

function limpiarTabla() {
  Swal.fire({
    title: "¿Limpiar tabla?",
    text: "Se eliminarán todos los registros y se reiniciará el contador.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#00d4ff",
    cancelButtonColor: "#2a2e37",
    confirmButtonText: "Sí, limpiar",
    cancelButtonText: "Cancelar",
    background: "#1a1d23",
    color: "#e4e6eb",
  }).then((result) => {
    if (result.isConfirmed) {
      const filas = document.querySelectorAll("#cuerpoTabla tr");
      animate(filas, {
        opacity: [1, 0],
        translateX: [0, 30],
        duration: 300,
        delay: stagger(40, { from: "last" }),
        ease: "inQuad",
        onComplete: function () {
          estudiantesRegistrados.length = 0;
          contadorEstudiantes = 0;
          editandoIndex = null;
          btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i>Agregar estudiante';
          btnAgregar.classList.remove("btn-warning-custom");
          btnAgregar.classList.add("btn-accent");
          renderizarTabla(estudiantesRegistrados);
          actualizarTotal();
          mostrarToast("Tabla limpiada correctamente.", "secondary");
        },
      });
    }
  });
}

function editarEstudiante(index) {
  const estudiante = estudiantesRegistrados[index];
  document.getElementById("nombre").value = estudiante.nombre;
  document.getElementById("carrera").value = estudiante.carrera;
  document.getElementById("semestre").value = estudiante.semestre;

  editandoIndex = index;
  btnAgregar.innerHTML = '<i class="fas fa-save me-1"></i>Guardar cambios';
  btnAgregar.classList.remove("btn-accent");
  btnAgregar.classList.add("btn-warning-custom");

  animate("#nombre", {
    borderColor: ["#00d4ff", "#f59e0b", "#00d4ff"],
    duration: 800,
    ease: "inOutQuad",
  });

  mostrarToast("Editando estudiante: " + estudiante.nombre, "info");
}

function eliminarEstudiante(index) {
  const estudiante = estudiantesRegistrados[index];
  Swal.fire({
    title: "¿Eliminar estudiante?",
    text: 'Se eliminará a "' + estudiante.nombre + '" del registro.',
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#2a2e37",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    background: "#1a1d23",
    color: "#e4e6eb",
  }).then((result) => {
    if (result.isConfirmed) {
      estudiantesRegistrados.splice(index, 1);
      if (editandoIndex === index) {
        editandoIndex = null;
        btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i>Agregar estudiante';
        btnAgregar.classList.remove("btn-warning-custom");
        btnAgregar.classList.add("btn-accent");
        limpiarFormulario();
      } else if (editandoIndex !== null && editandoIndex > index) {
        editandoIndex--;
      }
      renderizarTabla(estudiantesRegistrados);
      actualizarTotal();
      mostrarToast("Estudiante eliminado correctamente.", "danger");
    }
  });
}

function mostrarModalJSONIndividual(estudiante) {
  const contenidoJSON = document.getElementById("contenidoJSON");
  document.getElementById("modalJSONLabel").innerHTML = '<i class="fas fa-code me-2"></i>JSON del estudiante';
  contenidoJSON.textContent = JSON.stringify(estudiante, null, 2);
  const modal = new bootstrap.Modal(document.getElementById("modalJSON"));
  modal.show();
  animate(".json-display", {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 400,
    delay: 100,
    ease: "outQuad",
  });
}

function mostrarModalJSONGeneral() {
  const contenidoJSON = document.getElementById("contenidoJSON");
  document.getElementById("modalJSONLabel").innerHTML = '<i class="fas fa-code me-2"></i>JSON de estudiantes registrados';

  if (estudiantesRegistrados.length === 0) {
    contenidoJSON.textContent = "No existen estudiantes registrados.";
  } else {
    contenidoJSON.textContent = JSON.stringify(estudiantesRegistrados, null, 2);
  }

  const modal = new bootstrap.Modal(document.getElementById("modalJSON"));
  modal.show();
  animate(".json-display", {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 400,
    delay: 100,
    ease: "outQuad",
  });
}

function buscarEstudiantes() {
  const texto = document.getElementById("buscarTexto").value.trim().toLowerCase();

  if (texto === "") {
    mostrarToast("Ingrese un texto para buscar.", "warning");
    animate("#buscarTexto", {
      borderColor: ["#ef4444", "#2a2e37"],
      duration: 600,
      ease: "inOutQuad",
    });
    return;
  }

  const resultados = estudiantesRegistrados.filter((estudiante) => {
    return (
      estudiante.nombre.toLowerCase().includes(texto) ||
      estudiante.carrera.toLowerCase().includes(texto) ||
      estudiante.semestre.toString().includes(texto)
    );
  });

  renderizarTabla(resultados);

  if (resultados.length === 0) {
    mostrarToast("No se encontraron resultados.", "warning");
  } else {
    mostrarToast("Se encontraron " + resultados.length + " resultado(s).", "info");
  }
}

function limpiarBusqueda() {
  document.getElementById("buscarTexto").value = "";
  document.getElementById("filtroCarrera").value = "Todas";
  renderizarTabla(estudiantesRegistrados);
  mostrarToast("Búsqueda limpiada. Mostrando todos los registros.", "info");
}

function filtrarPorCarrera() {
  const carreraSeleccionada = document.getElementById("filtroCarrera").value;

  if (carreraSeleccionada === "Todas") {
    renderizarTabla(estudiantesRegistrados);
    mostrarToast("Mostrando todos los estudiantes.", "info");
    return;
  }

  const resultados = estudiantesRegistrados.filter((estudiante) => {
    return estudiante.carrera === carreraSeleccionada;
  });

  renderizarTabla(resultados);

  if (resultados.length === 0) {
    mostrarToast("No hay estudiantes en la carrera seleccionada.", "warning");
  } else {
    mostrarToast("Se encontraron " + resultados.length + " estudiante(s) en " + carreraSeleccionada + ".", "info");
  }
}

function mostrarToast(texto, tipo) {
  let colorFondo;
  switch (tipo) {
    case "success":
      colorFondo = "linear-gradient(135deg, #00b09b, #96c93d)";
      break;
    case "danger":
      colorFondo = "linear-gradient(135deg, #ff416c, #ff4b2b)";
      break;
    case "warning":
      colorFondo = "linear-gradient(135deg, #f7971e, #ffd200)";
      break;
    case "info":
      colorFondo = "linear-gradient(135deg, #00d4ff, #0088cc)";
      break;
    default:
      colorFondo = "linear-gradient(135deg, #636e72, #b2bec3)";
  }

  Toastify({
    text: texto,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: colorFondo,
      borderRadius: "10px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      fontSize: "0.875rem",
      fontWeight: "600",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    },
  }).showToast();
}