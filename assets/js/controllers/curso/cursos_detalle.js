let materiasCache = [];
let ordenMateriasActual = "nombre";
let cursoActual = null;
let planesCache = null;
let modoMateria = "crear";

document.addEventListener("DOMContentLoaded", () => {
  const ordenMaterias = document.getElementById("ordenMaterias");
  if (ordenMaterias) {
    ordenMaterias.addEventListener("change", (event) => {
      ordenMateriasActual = event.target.value;
      renderMaterias(materiasCache);
    });
  }

  const btnEditarCurso = document.getElementById("btnEditarCurso");
  if (btnEditarCurso) {
    btnEditarCurso.addEventListener("click", abrirEditarCurso);
  }

  const btnEliminarCurso = document.getElementById("btnEliminarCurso");
  if (btnEliminarCurso) {
    btnEliminarCurso.addEventListener("click", eliminarCurso);
  }

  const btnCancelarCurso = document.getElementById("btnCancelarCurso");
  if (btnCancelarCurso) {
    btnCancelarCurso.addEventListener("click", () => ocultarModal("modalCurso"));
  }

  const btnCancelarMateria = document.getElementById("btnCancelarMateria");
  if (btnCancelarMateria) {
    btnCancelarMateria.addEventListener("click", () => ocultarModal("modalMateria"));
  }

  const btnAgregarMateria = document.getElementById("btnAgregarMateria");
  if (btnAgregarMateria) {
    btnAgregarMateria.addEventListener("click", abrirCrearMateria);
  }

  const formCursoEditar = document.getElementById("formCursoEditar");
  if (formCursoEditar) {
    formCursoEditar.addEventListener("submit", actualizarCurso);
  }

  const formMateriaEditar = document.getElementById("formMateriaEditar");
  if (formMateriaEditar) {
    formMateriaEditar.addEventListener("submit", guardarMateria);
  }

  const idCurso = localStorage.getItem("id_curso");
  if (!idCurso) {
    mostrarError("No se encontró el curso seleccionado. Volviendo al listado...");
    ocultarSkeleton();
    if (window.top && typeof window.top.cargarVista === "function") {
      setTimeout(() => {
        window.top.cargarVista("cursos/cursos_general.html");
      }, 800);
    }
    return;
  }

  cargarCurso(idCurso);
});

async function cargarCurso(idCurso) {
  ocultarError();
  mostrarSkeleton();

  try {
    const res = await fetchWithAuth(`/cursos/${idCurso}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      throw new Error("No se pudo cargar el curso");
    }

    const data = await res.json();
    const curso = data.curso || data;
    const materias = Array.isArray(data.materias) ? data.materias : [];

    if (!curso) {
      throw new Error("Curso no encontrado");
    }

    cursoActual = curso;
    renderCurso(curso);
    materiasCache = materias;
    renderMaterias(materiasCache);

    mostrarContenido();
  } catch (error) {
    console.error(error);
    mostrarError("No se pudo cargar el curso.");
  } finally {
    ocultarSkeleton();
  }
}

function renderCurso(curso) {
  const titulo = document.getElementById("cursoTitulo");
  const anioLectivo = document.getElementById("anioLectivo");
  const nombrePlan = document.getElementById("nombrePlan");
  const descripcionPlan = document.getElementById("descripcionPlan");

  if (titulo) {
    titulo.textContent = `${curso.anio} Año - División ${curso.division}`;
  }
  if (anioLectivo) {
    anioLectivo.textContent = `Año lectivo ${curso.anio_lectivo}`;
  }
  if (nombrePlan) {
    nombrePlan.textContent = curso.nombre_plan || "Sin plan asignado";
  }
  if (descripcionPlan) {
    descripcionPlan.textContent = curso.descripcion || "Sin descripción disponible";
  }
}

function renderMaterias(materias) {
  const contenedor = document.getElementById("listaMaterias");
  const emptyState = document.getElementById("materiasEmpty");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (!materias || materias.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  const materiasOrdenadas = [...materias];
  if (ordenMateriasActual === "profesor") {
    materiasOrdenadas.sort((a, b) => (a.profesor || "").localeCompare(b.profesor || ""));
  } else {
    materiasOrdenadas.sort((a, b) => (a.nombre_materia || "").localeCompare(b.nombre_materia || ""));
  }

  const cards = materiasOrdenadas.map(materia => {
    const profesor = materia.profesor ? materia.profesor : "Sin asignar";
    const rol = materia.rol_profesor ? materia.rol_profesor : "Sin rol";
    const materiaId = String(materia.id_materia);
    return `
      <div class="bg-white border rounded-lg p-4 hover:shadow transition">
        <h3 class="font-semibold text-lg">${materia.nombre_materia || "Materia sin nombre"}</h3>
        <div class="mt-2 text-sm text-gray-600">
          <p><span class="font-medium">Profesor:</span> ${profesor}</p>
          <p class="flex items-center gap-2"><span class="font-medium">Rol:</span> ${renderRolBadge(rol)}</p>
        </div>
        <div class="mt-3 flex items-center justify-end gap-2">
          <button class="px-3 py-1 text-xs rounded-md border" onclick="abrirEditarMateria('${materiaId}')">Editar</button>
          <button class="px-3 py-1 text-xs rounded-md bg-red-500 text-white" onclick="eliminarMateria('${materiaId}')">Eliminar</button>
        </div>
      </div>
    `;
  }).join("");

  contenedor.innerHTML = cards;
}

function renderRolBadge(rol) {
  const rolLower = (rol || "").toLowerCase();
  let classes = "bg-gray-100 text-gray-700";

  if (rolLower.includes("titular")) {
    classes = "bg-blue-100 text-blue-700";
  } else if (rolLower.includes("suplente")) {
    classes = "bg-yellow-100 text-yellow-800";
  }

  return `<span class="${classes} text-xs px-2 py-1 rounded">${rol}</span>`;
}

function mostrarContenido() {
  const cursoContenido = document.getElementById("cursoContenido");
  if (cursoContenido) cursoContenido.classList.remove("hidden");
}

function mostrarSkeleton() {
  const cursoSkeleton = document.getElementById("cursoSkeleton");
  const cursoContenido = document.getElementById("cursoContenido");
  if (cursoContenido) cursoContenido.classList.add("hidden");
  if (cursoSkeleton) cursoSkeleton.classList.remove("hidden");
}

function ocultarSkeleton() {
  const cursoSkeleton = document.getElementById("cursoSkeleton");
  if (cursoSkeleton) cursoSkeleton.classList.add("hidden");
}

function mostrarError(mensaje) {
  const cursoError = document.getElementById("cursoError");
  if (cursoError) {
    cursoError.textContent = mensaje;
    cursoError.classList.remove("hidden");
  }
}

function ocultarError() {
  const cursoError = document.getElementById("cursoError");
  if (cursoError) cursoError.classList.add("hidden");
}

async function abrirEditarCurso() {
  if (!cursoActual) return;
  await cargarPlanes();
  const cursoAnio = document.getElementById("cursoAnio");
  const cursoDivision = document.getElementById("cursoDivision");
  const cursoAnioLectivo = document.getElementById("cursoAnioLectivo");
  const cursoPlan = document.getElementById("cursoPlan");

  if (cursoAnio) cursoAnio.value = cursoActual.anio || "";
  if (cursoDivision) cursoDivision.value = cursoActual.division || "";
  if (cursoAnioLectivo) cursoAnioLectivo.value = cursoActual.anio_lectivo || "";
  if (cursoPlan) cursoPlan.value = cursoActual.id_plan || "";

  mostrarModal("modalCurso");
}

async function cargarPlanes() {
  if (planesCache) {
    renderPlanesSelect(planesCache);
    return;
  }
  try {
    const res = await fetchWithAuth("/planes");
    const data = await res.json();
    planesCache = Array.isArray(data) ? data : [];
    renderPlanesSelect(planesCache);
  } catch (error) {
    console.error(error);
  }
}

function renderPlanesSelect(planes) {
  const cursoPlan = document.getElementById("cursoPlan");
  if (!cursoPlan) return;
  cursoPlan.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Seleccione un plan";
  cursoPlan.appendChild(placeholder);
  planes.forEach(plan => {
    const option = document.createElement("option");
    option.value = plan.id_plan;
    option.textContent = plan.nombre_plan;
    cursoPlan.appendChild(option);
  });
}

async function actualizarCurso(event) {
  event.preventDefault();
  if (!cursoActual) return;

  const anio = document.getElementById("cursoAnio").value;
  const division = document.getElementById("cursoDivision").value;
  const anioLectivo = document.getElementById("cursoAnioLectivo").value;
  const idPlan = document.getElementById("cursoPlan").value;

  try {
    const res = await fetchWithAuth(`/cursos/${cursoActual.id_curso}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anio,
        division,
        id_plan: idPlan,
        anio_lectivo: anioLectivo
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "No se pudo actualizar el curso.");
      return;
    }

    ocultarModal("modalCurso");
    cargarCurso(cursoActual.id_curso);
  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar el curso.");
  }
}

async function eliminarCurso() {
  if (!cursoActual) return;
  const confirmar = confirm("¿Eliminar el curso? Esta acción no se puede deshacer.");
  if (!confirmar) return;

  try {
    const res = await fetchWithAuth(`/cursos/${cursoActual.id_curso}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "No se pudo eliminar el curso.");
      return;
    }
    localStorage.removeItem("id_curso");
    if (window.top && typeof window.top.cargarVista === "function") {
      window.top.cargarVista("cursos/cursos_general.html");
      return;
    }
    window.location.href = "/views/cursos/cursos_general.html";
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el curso.");
  }
}

function abrirEditarMateria(idMateria) {
  const materia = materiasCache.find(m => String(m.id_materia) === String(idMateria));
  if (!materia) return;
  modoMateria = "editar";
  const titulo = document.getElementById("tituloModalMateria");
  if (titulo) titulo.textContent = "Actualizar materia";
  document.getElementById("materiaId").value = materia.id_materia;
  document.getElementById("materiaNombre").value = materia.nombre_materia || "";
  document.getElementById("materiaProfesor").value = materia.profesor || "";
  document.getElementById("materiaRol").value = materia.rol_profesor || "Titular";
  mostrarModal("modalMateria");
}

function abrirCrearMateria() {
  modoMateria = "crear";
  const titulo = document.getElementById("tituloModalMateria");
  if (titulo) titulo.textContent = "Agregar materia";
  document.getElementById("materiaId").value = "";
  document.getElementById("materiaNombre").value = "";
  document.getElementById("materiaProfesor").value = "";
  document.getElementById("materiaRol").value = "Titular";
  mostrarModal("modalMateria");
}

async function guardarMateria(event) {
  event.preventDefault();
  const nombre = document.getElementById("materiaNombre").value.trim();
  const profesor = document.getElementById("materiaProfesor").value.trim();
  const rolProfesor = document.getElementById("materiaRol").value;

  try {
    if (modoMateria === "crear") {
      const res = await fetchWithAuth(`/materias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, profesor, rolProfesor, idCurso: cursoActual?.id_curso })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "No se pudo crear la materia.");
        return;
      }
    } else {
      const idMateria = document.getElementById("materiaId").value;
      if (!idMateria) return;
      const res = await fetchWithAuth(`/materias/${idMateria}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, profesor, rolProfesor, idCurso: cursoActual?.id_curso })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "No se pudo actualizar la materia.");
        return;
      }
    }
    ocultarModal("modalMateria");
    cargarCurso(cursoActual.id_curso);
  } catch (error) {
    console.error(error);
    alert("No se pudo guardar la materia.");
  }
}

async function eliminarMateria(idMateria) {
  const confirmar = confirm("¿Eliminar la materia? Esta acción no se puede deshacer.");
  if (!confirmar) return;

  try {
    const res = await fetchWithAuth(`/materias/${idMateria}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "No se pudo eliminar la materia.");
      return;
    }
    cargarCurso(cursoActual.id_curso);
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar la materia.");
  }
}

function mostrarModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("hidden");
  if (modal) modal.classList.add("flex");
}

function ocultarModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
  if (modal) modal.classList.remove("flex");
}
