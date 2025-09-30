let listaMesas = JSON.parse(localStorage.getItem("listaMesas")) || [];
let mesaAEliminar = null;

function guardarListaMesas() {
    localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
}

function estaMesaOcupada(mesa) {
    const ahora = new Date();
    const listaReservas = JSON.parse(localStorage.getItem("listaReservas")) || [];
    
    const reservasActivas = listaReservas.filter(reserva => {
        if (reserva.idMesaAsignada !== mesa.ubicacionMesa) return false;
        if (reserva.estadoReserva === "Cancelada" || reserva.estadoReserva === "Finalizada") return false;
        
        const inicioReserva = new Date(`${reserva.fechaReserva}T${reserva.horaReserva}`);
        const finReserva = new Date(inicioReserva.getTime() + (reserva.duracionHoras || 2) * 60 * 60 * 1000);
        
        return ahora >= inicioReserva && ahora <= finReserva;
    });
    
    return reservasActivas.length > 0;
}

function estaMesaDisponibleEnHorario(mesa, fecha, hora, duracion, indiceReservaEditar = null) {
    const listaReservas = JSON.parse(localStorage.getItem("listaReservas")) || [];
    const inicioNuevaReserva = new Date(`${fecha}T${hora}`);
    const finNuevaReserva = new Date(inicioNuevaReserva.getTime() + duracion * 60 * 60 * 1000);

    return !listaReservas.some((reserva, i) => {
        if (i === indiceReservaEditar) return false;
        if (reserva.idMesaAsignada !== mesa.ubicacionMesa) return false;
        if (reserva.estadoReserva === "Cancelada" || reserva.estadoReserva === "Finalizada") return false;
        
        const inicioExistente = new Date(`${reserva.fechaReserva}T${reserva.horaReserva}`);
        const finExistente = new Date(inicioExistente.getTime() + (reserva.duracionHoras || 2) * 60 * 60 * 1000);
        
        return inicioNuevaReserva < finExistente && finNuevaReserva > inicioExistente;
    });
}

function mostrarMesas() {
    const contenedorMesas = document.getElementById("contenedorMesas");
    contenedorMesas.innerHTML = "";

    if (listaMesas.length === 0) {
        contenedorMesas.innerHTML = `<p class="text-center text-muted">No hay mesas registradas</p>`;
        return;
    }

    listaMesas.forEach((mesa, indice) => {
        let estadoReal = mesa.estadoMesa;
        if (mesa.estadoMesa === "disponible" && estaMesaOcupada(mesa)) {
            estadoReal = "ocupada";
        } else if (mesa.estadoMesa === "disponible") {
            estadoReal = "disponible";
        }
        
        let divMesa = document.createElement("div");
        divMesa.classList.add("col-md-3");
        divMesa.innerHTML = `
            <div class="card tarjeta-mesa estado-${estadoReal}">
                <h5>${mesa.nombreMesa}</h5>
                <p>Capacidad: ${mesa.capacidadMesa}</p>
                <p>Ubicación: ${mesa.ubicacionMesa}</p>
                <p>Estado: ${estadoReal}</p>
                <div class="mt-2">
                    <button class="btn btn-primary btn-sm" onclick="reservarMesa(${indice})" ${estadoReal !== "disponible" ? "disabled" : ""}>Reservar</button>
                    <button class="btn btn-warning btn-sm" onclick="abrirEdicionMesa(${indice})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="borrarMesa(${indice})">Eliminar</button>
                </div>
            </div>
        `;
        contenedorMesas.appendChild(divMesa);
    });
}

document.getElementById("btnAgregarMesa").addEventListener("click", () => {
    document.getElementById("formularioMesa").reset();
    document.getElementById("indiceMesa").value = "";
    document.getElementById("grupoEstadoMesa").classList.add("d-none");
    
    const modal = new bootstrap.Modal(document.getElementById("modalMesa"), {
    backdrop: 'static',
    keyboard: false
    });
    modal.show();
});

document.getElementById("formularioMesa").addEventListener("submit", (e) => {
    e.preventDefault();

    const indice = document.getElementById("indiceMesa").value;
    const capacidad = document.getElementById("inputCapacidadMesa").value;
    const ubicacion = document.getElementById("selectUbicacion").value;
    const estado = indice ? document.getElementById("selectEstadoMesa").value : "disponible";

    if (indice) {
        listaMesas[indice].capacidadMesa = capacidad;
        listaMesas[indice].ubicacionMesa = ubicacion;
        listaMesas[indice].estadoMesa = estado;
    } else {
        listaMesas.push({
            nombreMesa: `Mesa ${listaMesas.length + 1}`,
            capacidadMesa: capacidad,
            ubicacionMesa: ubicacion,
            estadoMesa: "disponible"
        });
    }

    guardarListaMesas();
    mostrarMesas();

    const mensaje = indice ? "¡Mesa editada correctamente!" : "¡Mesa guardada correctamente!";
    const texto = indice ? "La mesa fue editada correctamente." : "La mesa fue registrada correctamente.";

    Swal.fire({
        icon: "success",
        title: mensaje,
        text: texto,
        confirmButtonText: "Aceptar"
    });

    bootstrap.Modal.getInstance(document.getElementById("modalMesa")).hide();
    e.target.reset();
});

function reservarMesa(indice) {
    const mesa = listaMesas[indice];

    if (mesa.estadoMesa !== "disponible" || estaMesaOcupada(mesa)) {
        Swal.fire({
            icon: "error",
            title: "Mesa no disponible",
            text: "Esta mesa no está disponible para reservar en este momento.",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    localStorage.setItem("mesaSeleccionada", JSON.stringify(mesa));
    window.location.href = "reservas.html";
}

function abrirEdicionMesa(indice) {
    const mesa = listaMesas[indice];
    document.getElementById("indiceMesa").value = indice;
    document.getElementById("inputCapacidadMesa").value = mesa.capacidadMesa;
    document.getElementById("selectUbicacion").value = mesa.ubicacionMesa;
    document.getElementById("selectEstadoMesa").value = mesa.estadoMesa;
    
    document.getElementById("grupoEstadoMesa").classList.remove("d-none");
    
    const modal = new bootstrap.Modal(document.getElementById("modalMesa"), {
    backdrop: 'static',
    keyboard: false
    });
    modal.show();
}

function borrarMesa(indice) {
    mesaAEliminar = indice;
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarMesa"));
    modal.show();
}

document.getElementById("confirmarEliminarMesa").addEventListener("click", () => {
    if (mesaAEliminar !== null) {
        listaMesas.splice(mesaAEliminar, 1);
        guardarListaMesas();
        mostrarMesas();
        mesaAEliminar = null;
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEliminarMesa"));
    modal.hide();

    Swal.fire({
        icon: "success",
        title: "Mesa eliminada",
        text: "La mesa fue eliminada correctamente.",
        confirmButtonText: "Aceptar"
    });
});

setInterval(() => {
    mostrarMesas();
}, 60000);

document.addEventListener("DOMContentLoaded", mostrarMesas);
