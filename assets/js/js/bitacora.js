document.addEventListener('DOMContentLoaded', function() {
    // ========== RESTRICCIÓN DE ACCESO POR ROL ==========
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = "Login.html";
        return;
    } else {
        const usuario = JSON.parse(usuarioStr);
        const rol = usuario.rol ? usuario.rol.toLowerCase() : "";
        if (rol !== "administrador" && rol !== "soporte") {
            alert("Acceso restringido. Solo Administradores y Soporte pueden acceder.");
            window.location.href = "inicio.html";
            return;
        }
    }

    // ========== PAGINACIÓN Y FILTROS DE LOGS ==========
    let paginaLog = 1;
    let limiteLog = 10;
    let search = "";
    let fechaInicio = "";
    let fechaFin = "";
    let operacionSeleccionada = ""; // inicializada correctamente

    // Elementos
    const cantidadLogs = document.getElementById('cantidadLogs');
    const buscador = document.getElementById('buscador');
    const fechaInicioElem = document.getElementById('fechaInicio');
    const fechaFinElem = document.getElementById('fechaFin');
    const btnBuscarLogs = document.getElementById('btnBuscarLogs');
    const prevLogBtn = document.getElementById('prevLogBtn');
    const nextLogBtn = document.getElementById('nextLogBtn');
    const paginacionLogsInfo = document.getElementById('paginacionLogsInfo');
    const tablaBitacoraBody = document.querySelector("#tablaBitacora tbody");
    const noDatos = document.getElementById('noDatos');
    const operacionFilter = document.getElementById('operacionFilter');

    // Seguridad: si faltan elementos críticos, salimos silenciosamente
    if (!tablaBitacoraBody || !paginacionLogsInfo) return;

    // ========== EVENTOS ==========
    if (cantidadLogs) {
        cantidadLogs.addEventListener('change', function() {
            limiteLog = parseInt(this.value) || 10;
            paginaLog = 1;
            cargarLogs();
        });
    }

    if (buscador) {
        buscador.addEventListener('input', function() {
            search = this.value;
            paginaLog = 1;
            cargarLogs();
        });
    }

    if (fechaInicioElem) {
        fechaInicioElem.addEventListener('change', function() {
            fechaInicio = this.value;
        });
    }

    if (fechaFinElem) {
        fechaFinElem.addEventListener('change', function() {
            fechaFin = this.value;
        });
    }

    if (btnBuscarLogs) {
        btnBuscarLogs.addEventListener('click', function() {
            paginaLog = 1;
            cargarLogs();
        });
    }

    if (prevLogBtn) {
        prevLogBtn.addEventListener('click', function() {
            if (paginaLog > 1) {
                paginaLog--;
                cargarLogs();
            }
        });
    }

    if (nextLogBtn) {
        nextLogBtn.addEventListener('click', function() {
            paginaLog++;
            cargarLogs();
        });
    }

    // Listener para el filtro de operación (si existe en la vista)
    if (operacionFilter) {
        operacionFilter.addEventListener('change', function() {
            operacionSeleccionada = this.value || "";
            paginaLog = 1;
            cargarLogs();
        });
    }

    // ========== FUNCIÓN: CARGAR OPERACIONES (para el dropdown) ==========
    async function cargarOperaciones() {
        if (!operacionFilter) return;
        try {
            const res = await fetch('http://localhost:3000/api/logs/operaciones');
            if (!res.ok) {
                console.warn('No se pudieron cargar las operaciones, status:', res.status);
                return;
            }
            const data = await res.json();
            const ops = data.rows || data; // acepta ambos formatos
            // limpiar y agregar opción "Todas"
            operacionFilter.innerHTML = '<option value="">-- Todas --</option>';
            ops.forEach(op => {
                // campos esperados: id_operacion, descripcion
                const id = op.id_operacion ?? op.id ?? op.idOperacion ?? op.idOperacion;
                const desc = op.descripcion ?? op.descripcion_operacion ?? op.name ?? op.descripcion;
                // fallback: stringify op
                const text = desc || JSON.stringify(op);
                const value = id ?? text;
                operacionFilter.innerHTML += `<option value="${value}">${text}</option>`;
            });
        } catch (err) {
            console.error('Error cargando operaciones:', err);
        }
    }

    // ========== FUNCIÓN PRINCIPAL: CARGAR LOGS ==========
    async function cargarLogs() {
        let query = `?page=${paginaLog}&limit=${limiteLog}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (fechaInicio) query += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) query += `&fechaFin=${fechaFin}`;
        if (operacionSeleccionada) query += `&id_operacion=${encodeURIComponent(operacionSeleccionada)}`;

        try {
            const res = await fetch(`http://localhost:3000/api/logs${query}`);
            if (!res.ok) {
                tablaBitacoraBody.innerHTML = `<tr><td colspan="7" class="text-center text-red-500 p-4">Error al cargar los logs (status ${res.status})</td></tr>`;
                return;
            }
            const data = await res.json();
            tablaBitacoraBody.innerHTML = "";
            if (data.logs && data.logs.length > 0) {
                noDatos.classList.add('hidden');
                data.logs.forEach(log => {
                    // intentar leer la fecha desde distintos campos posibles
                    const fechaCampo = log.hora_y_fecha ?? log.fecha ?? log.created_at;
                    const date = fechaCampo ? new Date(fechaCampo) : null;
                    const fechaLocal = date ? date.toLocaleString('es-AR', {
                        timeZone: 'America/Argentina/Buenos_Aires',
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    }) : '';

                    tablaBitacoraBody.innerHTML += `
                        <tr>
                            <td class="px-4 py-2">${fechaLocal}</td>
                            <td class="px-4 py-2">${log.usuario || ''}</td>
                            <td class="px-4 py-2">${log.operacion || ''}</td>
                            <td class="px-4 py-2">${log.detalle || ''}</td>
                            <td class="px-4 py-2">${log.ip || ''}</td>
                            <td class="px-4 py-2">${log.mac || ''}</td>
                            <td class="px-4 py-2">${log.usuario_afectado || ''}</td>
                        </tr>
                    `;
                });
                // PAGINACIÓN INFO
                const inicio = (paginaLog - 1) * limiteLog + 1;
                const fin = Math.min(paginaLog * limiteLog, data.total || 0);
                paginacionLogsInfo.textContent = `Mostrando ${inicio} a ${fin} de ${data.total || 0} logs`;

                if (prevLogBtn) prevLogBtn.disabled = paginaLog === 1;
                if (nextLogBtn) nextLogBtn.disabled = paginaLog * limiteLog >= (data.total || 0);
            } else {
                noDatos.classList.remove('hidden');
                paginacionLogsInfo.textContent = "No hay registros.";
                if (prevLogBtn) prevLogBtn.disabled = true;
                if (nextLogBtn) nextLogBtn.disabled = true;
            }
        } catch (err) {
            console.error('Error en cargarLogs:', err);
            tablaBitacoraBody.innerHTML = '<tr><td colspan="7" class="text-center text-red-500 p-4">Error al cargar los logs</td></tr>';
        }
    }

    // CARGA INICIAL
    // cargarOperaciones primero para que el usuario pueda filtrar desde el inicio
    cargarOperaciones();
    cargarLogs();
});