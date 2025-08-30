let listaReservas = JSON.parse(localStorage.getItem("listaReservas")) || [];
let listaMesas = JSON.parse(localStorage.getItem("listaMesas")) || [];

function guardarListaReservas() {
    localStorage.setItem("listaReservas", JSON.stringify(listaReservas));
}

function mostrarReservas(lista = listaReservas) {
    const contenedorReservas = document.getElementById("contenedorReservas");
    contenedorReservas.innerHTML = "";

    if (lista.length === 0) {
        contenedorReservas.innerHTML = `<p class="text-center text-muted">No hay reservas registradas</p>`;
        return;
    }

    lista.forEach((reserva, indice) => {
        let divReserva = document.createElement("div");
        divReserva.classList.add("col-md-4");
        divReserva.innerHTML = `
            <div class="card tarjeta-reserva">
                <div class="card-body">
                    <h5>${reserva.nombreCliente}</h5>
                    <p>📅${reserva.fechaReserva} ${reserva.horaReserva}</p>
                    <p>Mesa: 🍽️${reserva.idMesaAsignada}</p>
                    <p>Personas: 🧑‍🤝‍🧑${reserva.numeroPersonas}</p>
                    <p>Ocasión: 📆${reserva.ocasionEspecial || "N/A"}</p>
                    <p>Notas: 🗒️${reserva.NotasAdicionales || "Ninguna"}</p>
                    <p>Estado: <b>${reserva.estadoReserva}</b></p>
                    <div class="mt-2 d-flex gap-1 flex-wrap">
                        <button class="btn btn-warning btn-sm" onclick="abrirEdicionReserva(${indice})">Editar</button>
                        <button class="btn btn-success btn-sm" onclick="confirmarReserva(${indice})">Pagar</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${indice})">Cancelar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${indice})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedorReservas.appendChild(divReserva);
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
    const nombreCliente = document.getElementById("inputNombreCliente").value;
    const numeroPersonas = document.getElementById("inputNumeroPersonas").value;
    const fechaReserva = document.getElementById("inputFechaReserva").value;
    const horaReserva = document.getElementById("inputHoraReserva").value;
    const ocasionEspecial = document.getElementById("selectOcasiones").value;
    const NotasAdicionales = document.getElementById("StringNotasAdicionales").value;
    const idMesaAsignada = document.getElementById("selectMesasDisponibles").value;

    if (!horaReserva) {
        Swal.fire("Error", "La hora de la reserva es obligatoria.", "error");
        return;
    }

    const [hora, minutos] = horaReserva.split(":").map(Number);
    if (hora < 8 || (hora > 20) || (hora === 20 && minutos > 0)) {
        Swal.fire("Error", "La hora debe estar entre 08:00 AM y 08:00 PM.", "error");
        return;
    }

    if (indice) {
        const estadoReserva = document.getElementById("selectEstadoReserva").value;

        listaReservas[indice] = {
            ...listaReservas[indice],
            nombreCliente,
            numeroPersonas,
            fechaReserva,
            horaReserva,
            ocasionEspecial,
            NotasAdicionales,
            idMesaAsignada,
            estadoReserva
        };

        let mesa = listaMesas.find(m => m.nombreMesa === idMesaAsignada);
        if (mesa) {
            if (estadoReserva === "Pendiente" || estadoReserva === "Confirmada") {
            mesa.estadoMesa = "ocupada";
        }else {
            mesa.estadoMesa = "disponible";
        }
        localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
    }
    
    } else {
        listaReservas.push({
            idReserva: `res${listaReservas.length + 1}`,
            nombreCliente,
            numeroPersonas,
            fechaReserva,
            horaReserva,
            ocasionEspecial,
            NotasAdicionales,
            idMesaAsignada,
            estadoReserva: "Pendiente"
        });

        let mesa = listaMesas.find(m => m.nombreMesa === idMesaAsignada);
        if (mesa) {
            mesa.estadoMesa = "ocupada";
            localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
        }
    }

    guardarListaReservas();
    mostrarReservas();
    bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();

    Swal.fire("Éxito", "Reserva guardada correctamente", "success");
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
    let mesa = listaMesas.find(m => m.nombreMesa === listaReservas[indice].idMesaAsignada);
    if (mesa) {
        mesa.estadoMesa = "disponible";
        localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
    }
    guardarListaReservas();
    mostrarReservas();
}

function confirmarReserva(indice) {
    listaReservas[indice].estadoReserva = "Finalizada";
    let mesa = listaMesas.find(m => m.nombreMesa === listaReservas[indice].idMesaAsignada); 
    if (mesa) {
        mesa.estadoMesa = "disponible";
        localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
    }

    guardarListaReservas();
    mostrarReservas();

    Swal.fire("Éxito", "La reserva ha sido pagada y finalizada. La mesa está disponible nuevamente.", "success");
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
            let mesa = listaMesas.find(m => m.nombreMesa === listaReservas[indice].idMesaAsignada);
            if (mesa) {
                mesa.estadoMesa = "disponible";
                localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
            }
            listaReservas.splice(indice, 1);
            guardarListaReservas();
            mostrarReservas();

            Swal.fire("Eliminada", "La reserva ha sido eliminada", "success");
        }
    });
}

function cargarMesasDisponibles() {
    const selectMesas = document.getElementById("selectMesasDisponibles");
    selectMesas.innerHTML = "";
    listaMesas
        .filter(m => m.estadoMesa === "disponible")
        .forEach(m => {
            let option = document.createElement("option");
            option.value = m.nombreMesa;
            option.textContent = `${m.nombreMesa} - Capacidad ${m.capacidadMesa}`;
            selectMesas.appendChild(option);
        });
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
                select.innerHTML = `<option value="${mesaSeleccionada.nombreMesa}">
                    ${mesaSeleccionada.nombreMesa} - Capacidad ${mesaSeleccionada.capacidadMesa}
                </option>`;
                select.value = mesaSeleccionada.nombreMesa;
            }
            const inputPersonas = document.getElementById("inputNumeroPersonas");
            if (inputPersonas) {
                inputPersonas.value = mesaSeleccionada.capacidadMesa;
            }
        }, 200);

        localStorage.removeItem("mesaSeleccionada");
    }
});


