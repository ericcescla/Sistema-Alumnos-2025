document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector("#tabla-cursos tbody");
    fetchWithAuth("/cursos")
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

  fetchWithAuth('/planes')
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

  try {
    const response = await fetchWithAuth("/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const resData = await response.json();

    if (!response.ok) {
      alert(resData.error || "Ocurrió un error al crear el curso");
    } else {
      alert(resData.mensaje);
      location.reload();
    }
  } catch (error) {
    console.error("Error al agregar curso:", error);
    alert("Error al crear el curso");
  }
});



btnBuscarCurso.addEventListener("click", async () => {
  const anioLectivo = document.getElementById("inputAnio").value.trim();
  const anio = document.getElementById("selectCursoAnio").value;
  const division = document.getElementById("selectCursoDivision").value;

  if (!anioLectivo || !anio || !division) {
    alert("Por favor ingrese año lectivo y seleccione curso y división.");
    return;
  }

  try {
    const res = await fetchWithAuth(`/cursos/alumnosCurso?anioLectivo=${encodeURIComponent(anioLectivo)}&anio=${encodeURIComponent(anio)}&division=${encodeURIComponent(division)}`);
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
