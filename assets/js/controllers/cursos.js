document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector("#tabla-cursos tbody");
    fetch("/cursos")
    .then(res => res.json())
    .then(data => {
        data.forEach(curso => {
            const fila = document.createElement("tr");
            fila.className = "hover:bg-gray-100";  //color de fondo al pasar el mouse
            fila.innerHTML = `
            <td class="px-4 py-2 text-sm text-gray-700">${curso.id_curso}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${curso.anio}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${curso.division}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${curso.nombre_plan}</td>
             <td class="px-4 py-2 text-sm text-gray-700">${curso.anio_lectivo}</td>


                    <td>
                        <button class="ver-mas" onclick="mostrarModal()">Ver Mas</button>

                    </td>
                `

                tbody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al cargar los alumnos:", error);
        });
})


document.addEventListener("DOMContentLoaded", () => {
  const selectCurso = document.getElementById("selectCurso");

  if (selectCurso) {
    for (let anio = 1; anio <= 7; anio++) {
      let optgroup = document.createElement("optgroup");
      optgroup.label = `${anio}° Año`;

      for (let division = 1; division <= 4; division++) {
        let option = document.createElement("option");
        option.value = `${anio}°${division}°`;
        option.textContent = `${anio}°${division}°`;
        optgroup.appendChild(option);
      }

      selectCurso.appendChild(optgroup);
    }
  }
});

fetch('/planes')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('selectPlanes');
    data.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id_plan;
      option.textContent = plan.nombre_plan;
      select.appendChild(option);
    });
  });

// Manejar el submit del formulario
document.getElementById("formCurso").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  // Obtener el usuario logueado
  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  try {
    const response = await fetch("/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const resData = await response.json();

    if (!response.ok) {
      alert(resData.error || "Ocurrió un error al crear el curso");
    } else {
     //REGISTRAR EN LA BITÁCORA
      if (usuario) {
        await fetch('http://localhost:3000/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_operacion: 15,
            id_usuario: usuario.id_usuario,
            ip: null,
            detalle: `El usuario ${usuario.nombre} creó curso: ${data.anio}° ${data.division}° - Año lectivo ${data.anio_lectivo}`,
            usuario_afectado: null
          })
        });
      }

      alert(resData.mensaje);
      location.reload();
    }
  } catch (error) {
    console.error("Error al agregar curso:", error);
    alert("Error al crear el curso");
  }
});

// Buscar curso específico
btnBuscarCurso.addEventListener("click", async () => {
  const anioLectivo = document.getElementById("inputAnio").value.trim();
  const anio = document.getElementById("selectCursoAnio").value;
  const division = document.getElementById("selectCursoDivision").value;

  if (!anioLectivo || !anio || !division) {
    alert("Por favor ingrese año lectivo y seleccione curso y división.");
    return;
  }

  try {
    const res = await fetch(`/cursos/alumnosCurso?anioLectivo=${encodeURIComponent(anioLectivo)}&anio=${encodeURIComponent(anio)}&division=${encodeURIComponent(division)}`);
    const alumnos = await res.json();

    const contenidoResultados = document.getElementById("contenidoResultados");
    const modal = document.getElementById("modalResultados");
    const tituloModal = modal.querySelector("h2");

    if (alumnos.length === 0) {
      contenidoResultados.innerHTML = "<p>No se encontraron alumnos para esos datos.</p>";
    } else {
      tituloModal.textContent = `Curso ${alumnos[0].anio}${alumnos[0].division} — Año ${alumnos[0].anio_lectivo}`;

      // Tabla de resultados
      let html = `
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-default">
              <th class="px-4 py-3 text-left font-medium">ID</th>
              <th class="px-4 py-3 text-left font-medium">Legajo</th>
              <th class="px-4 py-3 text-left font-medium">Nombre</th>
              <th class="px-4 py-3 text-left font-medium">DNI</th>
            </tr>
          </thead>
          <tbody>
      `;
      alumnos.forEach(a => {
        html += `
          <tr>
            <td class="px-4 py-2 text-sm text-gray-700">${a.id_alumno}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${a.legajo}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${a.nombre}, ${a.apellido.toUpperCase()}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${a.dni}</td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
      contenidoResultados.innerHTML = html;
    }

    mostrarModal(modal);

    // Limpiar campos
    document.getElementById("inputAnio").value = "";
    document.getElementById("selectCursoAnio").value = "";
    document.getElementById("selectCursoDivision").value = "";
  } catch (err) {
    console.error("Error en búsqueda:", err);
    document.getElementById("contenidoResultados").innerHTML = "<p>Error al buscar alumnos.</p>";
    mostrarModal(document.getElementById("modalResultados"));
  }
});

// ==========================================
// ASIGNACIÓN DE ALUMNOS A CURSOS
// ==========================================

let alumnoSeleccionado = null;

// Cambiar entre pestañas
function cambiarTab(tab) {
  const tabIndividual = document.getElementById('tabIndividual');
  const tabMasiva = document.getElementById('tabMasiva');
  const contenidoIndividual = document.getElementById('contenidoIndividual');
  const contenidoMasiva = document.getElementById('contenidoMasiva');

  if (tab === 'individual') {
    tabIndividual.classList.add('active');
    tabMasiva.classList.remove('active');
    contenidoIndividual.classList.remove('hidden');
    contenidoMasiva.classList.add('hidden');
  } else {
    tabMasiva.classList.add('active');
    tabIndividual.classList.remove('active');
    contenidoMasiva.classList.remove('hidden');
    contenidoIndividual.classList.add('hidden');
  }
}

// Función para verificar y mostrar info del curso
async function verificarYMostrarInfoCurso(tipo) {
  const anio = denocument.getElementById(`anio${tipo}`).value;
  const division = document.getElementById(`division${tipo}`).value;
  const anioLectivo = document.getElementById(`anioLectivo${tipo}`).value;
  
  const infoDiv = document.getElementById(`infoCurso${tipo}`);
  const planSpan = document.getElementById(`plan${tipo}`);

  if (anio && division && anioLectivo) {
    try {
      const res = await fetch(`/cursos/obtener-info?anio=${encodeURIComponent(anio)}&division=${encodeURIComponent(division)}&anioLectivo=${encodeURIComponent(anioLectivo)}`);
      const curso = await res.json();

      if (curso && curso.nombre_plan) {
        planSpan.textContent = curso.nombre_plan;
        infoDiv.classList.remove('hidden');
      } else {
        infoDiv.classList.add('hidden');
      }
    } catch (error) {
      console.error('Error al obtener info del curso:', error);
      infoDiv.classList.add('hidden');
    }
  } else {
    infoDiv.classList.add('hidden');
  }
}

// Event listeners para mostrar plan en Individual
document.getElementById('anioIndividual')?.addEventListener('change', () => verificarYMostrarInfoCurso('Individual'));
document.getElementById('divisionIndividual')?.addEventListener('change', () => verificarYMostrarInfoCurso('Individual'));
document.getElementById('anioLectivoIndividual')?.addEventListener('input', () => verificarYMostrarInfoCurso('Individual'));

// Event listeners para mostrar plan en Masiva
document.getElementById('anioMasiva')?.addEventListener('change', () => verificarYMostrarInfoCurso('Masiva'));
document.getElementById('divisionMasiva')?.addEventListener('change', () => verificarYMostrarInfoCurso('Masiva'));
document.getElementById('anioLectivoMasiva')?.addEventListener('input', () => verificarYMostrarInfoCurso('Masiva'));

// Event listeners para las pestañas
document.getElementById('tabIndividual')?.addEventListener('click', () => cambiarTab('individual'));
document.getElementById('tabMasiva')?.addEventListener('click', () => cambiarTab('masiva'));

// ========== ASIGNACIÓN INDIVIDUAL ==========

document.getElementById('btnBuscarAlumnoIndividual')?.addEventListener('click', async () => {
  const dni = document.getElementById('dniAlumnoIndividual').value.trim();
  const datosDiv = document.getElementById('datosAlumnoIndividual');

  if (!dni) return alert('Ingrese un DNI');

  try {
    const res = await fetch(`/alumnos/buscarPorDni?dni=${dni}`);
    const alumno = await res.json();

    if (!alumno || alumno.error) {
      alert('Alumno no encontrado');
      datosDiv.classList.add('hidden');
      alumnoSeleccionado = null;
      return;
    }

    alumnoSeleccionado = alumno;
    
    // ✅ MEJORA: Crear contenido HTML con verificación de curso asignado
    let htmlContent = `
      <p><strong>Nombre:</strong> ${alumno.nombre} ${alumno.apellido}</p>
      <p><strong>DNI:</strong> ${alumno.dni}</p>
      <p><strong>Legajo:</strong> ${alumno.legajo}</p>
    `;

    // ✅ Mostrar advertencia si ya tiene curso asignado
    if (alumno.curso_asignado) {
      htmlContent += `
        <div class="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p class="text-sm text-yellow-800">
            <strong>⚠️ Atención:</strong> Este alumno ya tiene curso asignado:<br>
            <strong>${alumno.curso_asignado.anio}${alumno.curso_asignado.division}</strong> - 
            ${alumno.curso_asignado.nombre_plan} (${alumno.curso_asignado.anio_lectivo})
          </p>
        </div>
      `;
    }

    datosDiv.innerHTML = htmlContent;
    datosDiv.classList.remove('hidden');
    document.getElementById('btnAsignarIndividual').disabled = false;

  } catch (error) {
    console.error(error);
    alert('Error al buscar alumno');
  }
});

document.getElementById('btnAsignarIndividual')?.addEventListener('click', async () => {
  const anio = document.getElementById('anioIndividual').value;
  const division = document.getElementById('divisionIndividual').value;
  const anioLectivo = document.getElementById('anioLectivoIndividual').value;

  if (!alumnoSeleccionado) return alert('Busque un alumno primero');
  if (!anio || !division || !anioLectivo) return alert('Complete todos los campos del curso');

  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  if (confirm(`¿Asignar a ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido} al curso ${anio}${division} (${anioLectivo})?`)) {
    try {
      const res = await fetch('/cursos/asignar-individual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_alumno: alumnoSeleccionado.id_alumno,
          anio,
          division,
          anio_lectivo: anioLectivo
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al asignar alumno');
      } else {
        // Registrar en bitácora
        if (usuario) {
          await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_operacion: 16,
              id_usuario: usuario.id_usuario,
              ip: null,
              detalle: `El usuario ${usuario.nombre} asignó alumno ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido} (DNI: ${alumnoSeleccionado.dni}) al curso ${anio}${division} (${anioLectivo})`,
              usuario_afectado: null
            })
          });
        }

        alert(data.mensaje);
        cerrarModalPorId('modalAsignarAlumnos');
        location.reload();
      }
    } catch (error) {
      console.error(error);
      alert('Error al asignar alumno');
    }
  }
});

// ========== ASIGNACIÓN MASIVA ==========

document.getElementById('btnCargarAlumnosSinCurso')?.addEventListener('click', async () => {
  const anioLectivo = document.getElementById('anioLectivoMasiva').value.trim();

  if (!anioLectivo) return alert('Ingrese el año lectivo');

  try {
    const res = await fetch(`/cursos/alumnos-sin-curso?anioLectivo=${anioLectivo}`);
    const alumnos = await res.json();

    const contenedor = document.getElementById('contenedorAlumnosMasiva');
    const listaDiv = document.getElementById('listaAlumnosMasiva');

    if (alumnos.length === 0) {
      contenedor.innerHTML = '<p class="text-gray-600">No hay alumnos sin curso asignado para este año lectivo.</p>';
    } else {
      contenedor.innerHTML = alumnos.map(a => `
        <label class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
          <input type="checkbox" class="checkbox-alumno mr-3" value="${a.id_alumno}" data-nombre="${a.nombre} ${a.apellido}" data-dni="${a.dni}">
          <span>${a.nombre} ${a.apellido} - DNI: ${a.dni} - Legajo: ${a.legajo}</span>
        </label>
      `).join('');
    }

    listaDiv.classList.remove('hidden');

  } catch (error) {
    console.error(error);
    alert('Error al cargar alumnos');
  }
});


document.getElementById('btnAsignarMasiva')?.addEventListener('click', async () => {
  const anio = document.getElementById('anioMasiva').value;
  const division = document.getElementById('divisionMasiva').value;
  const anioLectivo = document.getElementById('anioLectivoMasiva').value;

  if (!anio || !division || !anioLectivo) return alert('Complete todos los campos del curso');

  const checkboxes = document.querySelectorAll('.checkbox-alumno:checked');
  if (checkboxes.length === 0) return alert('Seleccione al menos un alumno');

  const alumnosSeleccionados = Array.from(checkboxes).map(cb => ({
    id_alumno: parseInt(cb.value),
    nombre: cb.dataset.nombre,
    dni: cb.dataset.dni
  }));

  const usuarioStr = localStorage.getItem('usuario');
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  if (confirm(`¿Asignar ${alumnosSeleccionados.length} alumno(s) al curso ${anio}${division} (${anioLectivo})?`)) {
    try {
      const res = await fetch('/cursos/asignar-masiva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alumnos: alumnosSeleccionados.map(a => a.id_alumno),
          anio,
          division,
          anio_lectivo: anioLectivo
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al asignar alumnos');
      } else {
        // Registrar en bitácora
        if (usuario) {
          const detalleAlumnos = alumnosSeleccionados.map(a => `${a.nombre} (DNI: ${a.dni})`).join(', ');
          await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_operacion: 17,
              id_usuario: usuario.id_usuario,
              ip: null,
              detalle: `El usuario ${usuario.nombre} asignó ${alumnosSeleccionados.length} alumno(s) al curso ${anio}${division} (${anioLectivo}): ${detalleAlumnos}`,
              usuario_afectado: null
            })
          });
        }

        alert(data.mensaje);
        cerrarModalPorId('modalAsignarAlumnos');
        location.reload();
      }
    } catch (error) {
      console.error(error);
      alert('Error al asignar alumnos');
    }
  }
});

// Exponer función al scope global
window.cambiarTab = cambiarTab;