const DURACION_MS = 2 * 60 * 60 * 1000;

let listaReservas = JSON.parse(localStorage.getItem("listaReservas")) || [];
let listaMesas = JSON.parse(localStorage.getItem("listaMesas")) || [];

function guardarListaReservas() {
    localStorage.setItem("listaReservas", JSON.stringify(listaReservas));
}

function mostrarReservas(lista = listaReservas) {
    const contenedorReservas = document.getElementById("contenedorReservas");
    contenedorReservas.innerHTML = "";

    if (!lista || lista.length === 0) {
        contenedorReservas.innerHTML = `<p class="text-center text-muted">No hay reservas registradas</p>`;
        return;
    }

    const imagenesOcasion = {
        "Cumpleaños": "img/cumpleanos.png",
        "Aniversario": "img/aniversario.png",
        "Cena Romantica": "img/cena_romantica.png",
        "Reunión de Negocios": "img/negocios.png",
        "Reunion Familiar": "img/familiar.png",
        "Cena": "img/cena.png",
        "Despedida": "img/despedida.png",
        "Matrimonio": "img/matrimonio.png",
        "Ninguna": "img/default.png"
    };

    lista.forEach((reserva, indice) => {
        const estado = reserva.estadoReserva || "Pendiente";
        const imagen = imagenesOcasion[reserva.ocasionEspecial] || "img/default.jpg";

        const divReserva = document.createElement("div");
        divReserva.classList.add("col-md-4");
        divReserva.innerHTML = `
            <div class="card tarjeta-reserva">
                <img src="${imagen}" class="card-img-top" alt="${reserva.ocasionEspecial}">
                <div class="card-body">
                    <h5>${reserva.nombreCliente}</h5>
                    <p>📅 ${reserva.fechaReserva} ${reserva.horaReserva}</p>
                    <p>Mesa: 🍽️ ${reserva.idMesaAsignada}</p>
                    <p>Personas: 🧑‍🤝‍🧑 ${reserva.numeroPersonas}</p>
                    <p>Ocasión: ${reserva.ocasionEspecial || "N/A"}</p>
                    <p>Notas: ${reserva.NotasAdicionales || "Ninguna"}</p>
                    <p>Estado: <b>${estado}</b></p>
                    <div class="mt-2 d-flex gap-1 flex-wrap">
                        <button class="btn btn-warning btn-sm" onclick="abrirEdicionReserva(${indice})">Editar</button>
                        <button class="btn btn-success btn-sm" onclick="confirmarReserva(${indice})">Finalizar</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${indice})">Cancelar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${indice})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedorReservas.appendChild(divReserva);
    });
}

function hayConflictoReserva(nuevaReserva, indiceEditar = null) {
    const inicioNueva = new Date(`${nuevaReserva.fechaReserva}T${nuevaReserva.horaReserva}`);
    const finNueva = new Date(inicioNueva.getTime() + DURACION_MS);

    return listaReservas.some((reserva, i) => {
        if (i === indiceEditar) return false;
        if (!reserva.idMesaAsignada) return false;
        if (reserva.idMesaAsignada !== nuevaReserva.idMesaAsignada) return false;
        if (reserva.estadoReserva === "Cancelada") return false;

        const inicioExistente = new Date(`${reserva.fechaReserva}T${reserva.horaReserva}`);
        const finExistente = new Date(inicioExistente.getTime() + DURACION_MS);

        return inicioNueva < finExistente && finNueva > inicioExistente;
    });
}

document.getElementById("btnAgregarReserva").addEventListener("click", () => {
    cargarMesasDisponibles();
    document.getElementById("formularioReserva").reset();
    document.getElementById("indiceReserva").value = "";
    document.getElementById("grupoEstadoReserva").classList.add("d-none");
    new bootstrap.Modal(document.getElementById("modalReserva")).show();
});

document.getElementById("formularioReserva").addEventListener("submit", (e) => {
    e.preventDefault();

    const indice = document.getElementById("indiceReserva").value;
    const nombreCliente = document.getElementById("inputNombreCliente").value.trim();
    const numeroPersonas = parseInt(document.getElementById("inputNumeroPersonas").value);
    const fechaReserva = document.getElementById("inputFechaReserva").value;
    const horaReserva = document.getElementById("inputHoraReserva").value;
    const ocasionEspecial = document.getElementById("selectOcasiones").value;
    const NotasAdicionales = document.getElementById("StringNotasAdicionales").value.trim();
    const idMesaAsignada = document.getElementById("selectMesasDisponibles").value;
    const estadoReserva = indice ? document.getElementById("selectEstadoReserva").value : "Pendiente";

    if (!nombreCliente) {
        Swal.fire("Error", "Ingresa el nombre del cliente.", "error");
        return;
    }
    if (isNaN(numeroPersonas) || numeroPersonas <= 0) {
        Swal.fire("Error", "Ingresa número de personas válido.", "error");
        return;
    }
    if (!fechaReserva) {
        Swal.fire("Error", "Selecciona una fecha.", "error");
        return;
    }
    if (!horaReserva) {
        Swal.fire("Error", "Selecciona una hora.", "error");
        return;
    }

    const [h, m] = horaReserva.split(":").map(Number);
    if (h < 8 || h > 20 || (h === 20 && m > 0)) {
        Swal.fire("Error", "La hora debe estar entre 08:00 y 20:00.", "error");
        return;
    }

    const mesa = listaMesas.find(m => m.ubicacionMesa === idMesaAsignada);
    if (!mesa) {
        Swal.fire("Error", "Mesa no válida seleccionada.", "error");
        return;
    }
    if (numeroPersonas > Number(mesa.capacidadMesa)) {
        Swal.fire("Error", `La mesa ${mesa.ubicacionMesa} permite hasta ${mesa.capacidadMesa} personas.`, "error");
        return;
    }

    const nuevaReserva = {
        idReserva: indice ? listaReservas[indice].idReserva : `res${listaReservas.length + 1}`,
        nombreCliente,
        numeroPersonas,
        fechaReserva,
        horaReserva,
        ocasionEspecial,
        NotasAdicionales,
        idMesaAsignada,
        estadoReserva
    };

    const indiceEditar = indice ? parseInt(indice) : null;
    if (hayConflictoReserva(nuevaReserva, indiceEditar)) {
        Swal.fire("Error", `La mesa ${idMesaAsignada} tiene otra reserva en ese horario (choque).`, "error");
        return;
    }

    if (indice) {
        listaReservas[indiceEditar] = nuevaReserva;
    } else {
        listaReservas.push(nuevaReserva);
    }

    guardarListaReservas();

    Swal.fire("Éxito", "Reserva guardada correctamente", "success").then(() => {
    window.location.href = "mesas.html";
    });
});

function abrirEdicionReserva(indice) {
    cargarMesasDisponibles();
    const reserva = listaReservas[indice];
    document.getElementById("indiceReserva").value = indice;
    document.getElementById("inputNombreCliente").value = reserva.nombreCliente;
    document.getElementById("inputNumeroPersonas").value = reserva.numeroPersonas;
    document.getElementById("inputFechaReserva").value = reserva.fechaReserva;
    document.getElementById("inputHoraReserva").value = reserva.horaReserva;
    document.getElementById("selectOcasiones").value = reserva.ocasionEspecial;
    document.getElementById("StringNotasAdicionales").value = reserva.NotasAdicionales;
    document.getElementById("selectMesasDisponibles").value = reserva.idMesaAsignada;

    document.getElementById("grupoEstadoReserva").classList.remove("d-none");
    document.getElementById("selectEstadoReserva").value = reserva.estadoReserva;

    new bootstrap.Modal(document.getElementById("modalReserva")).show();
}

function cancelarReserva(indice) {
    listaReservas[indice].estadoReserva = "Cancelada";
    guardarListaReservas();
    mostrarReservas();
}

function confirmarReserva(indice) {
    listaReservas[indice].estadoReserva = "Finalizada";
    guardarListaReservas();
    mostrarReservas();
    Swal.fire("Éxito", "La reserva ha sido finalizada.", "success");
}

function eliminarReserva(indice) {
    Swal.fire({
        title: "¿Eliminar reserva?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            listaReservas.splice(indice, 1);
            guardarListaReservas();
            mostrarReservas();
            Swal.fire("Eliminada", "La reserva ha sido eliminada", "success");
        }
    });
}

function cargarMesasDisponibles() {
    const selectMesas = document.getElementById("selectMesasDisponibles");
    const inputPersonas = document.getElementById("inputNumeroPersonas");
    if (!selectMesas) return;
    selectMesas.innerHTML = "";

    listaMesas.forEach(m => {
        let option = document.createElement("option");
        option.value = m.ubicacionMesa;
        option.textContent = `${m.ubicacionMesa} - Capacidad ${m.capacidadMesa}`;
        selectMesas.appendChild(option);
    });

    function actualizarMaximo() {
        let mesa = listaMesas.find(mm => mm.ubicacionMesa === selectMesas.value);
        if (mesa && inputPersonas) {
            const capacidad = Number(mesa.capacidadMesa);
            inputPersonas.setAttribute("max", capacidad);
            if (parseInt(inputPersonas.value || 0) > capacidad) {
                inputPersonas.value = capacidad;
                Swal.fire("Error", `La mesa ${mesa.ubicacionMesa} solo permite hasta ${capacidad} personas.`, "error");
            }
        }
    }

    actualizarMaximo();
    selectMesas.addEventListener("change", actualizarMaximo);
    if (inputPersonas) inputPersonas.addEventListener("input", actualizarMaximo);
}

function filtrarReservas() {
    const filtroFecha = document.getElementById("filtroFecha").value;
    const filtroEstado = document.getElementById("filtroEstado").value;
    let reservasFiltradas = listaReservas;

    if (filtroFecha) {
        reservasFiltradas = reservasFiltradas.filter(r => r.fechaReserva === filtroFecha);
    }
    if (filtroEstado) {
        reservasFiltradas = reservasFiltradas.filter(r => r.estadoReserva === filtroEstado);
    }
    mostrarReservas(reservasFiltradas);
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarReservas();

    const mesaSeleccionada = JSON.parse(localStorage.getItem("mesaSeleccionada"));
    if (mesaSeleccionada) {
        cargarMesasDisponibles();
        document.getElementById("formularioReserva").reset();
        document.getElementById("indiceReserva").value = "";
        document.getElementById("grupoEstadoReserva").classList.add("d-none");

        new bootstrap.Modal(document.getElementById("modalReserva")).show();
        setTimeout(() => {
            const select = document.getElementById("selectMesasDisponibles");
            if (select) {
                select.innerHTML = `<option value="${mesaSeleccionada.ubicacionMesa}">
                    ${mesaSeleccionada.ubicacionMesa} - Capacidad ${mesaSeleccionada.capacidadMesa}
                </option>`;
                select.value = mesaSeleccionada.ubicacionMesa;
            }
            const inputPersonas = document.getElementById("inputNumeroPersonas");
            if (inputPersonas) {
                inputPersonas.value = mesaSeleccionada.capacidadMesa;
                inputPersonas.setAttribute("max", mesaSeleccionada.capacidadMesa);
            }
        }, 150);

        localStorage.removeItem("mesaSeleccionada");
    } else {
        cargarMesasDisponibles();
    }

    const filtroFecha = document.getElementById("filtroFecha");
    if (filtroFecha) filtroFecha.addEventListener("change", filtrarReservas);
    const filtroEstado = document.getElementById("filtroEstado");
    if (filtroEstado) filtroEstado.addEventListener("change", filtrarReservas);
});
