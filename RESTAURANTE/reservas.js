let listaReservas = JSON.parse(localStorage.getItem("listaReservas")) || [];
let listaMesas = JSON.parse(localStorage.getItem("listaMesas")) || [];

function guardarListaReservas() {
    localStorage.setItem("listaReservas", JSON.stringify(listaReservas));
}

function estaMesaDisponibleEnHorario(mesa, fecha, hora, duracion, indiceReservaEditar = null) {
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

function mostrarReservas(lista = listaReservas) {
    const contenedorReservas = document.getElementById("contenedorReservas");
    contenedorReservas.innerHTML = "";

    if (!lista || lista.length === 0) {
        contenedorReservas.innerHTML = `<p class="text-center text-muted">No hay reservas registradas</p>`;
        return;
    }

    const imagenesOcasion = {
        Cumpleaños: "img/cumpleanos.png",
        Aniversario: "img/aniversario.png",
        "Cena Romantica": "img/cena_romantica.png",
        "Reunión de Negocios": "img/negocios.png",
        "Reunion Familiar": "img/familiar.png", 
        Cena: "img/cena.png",
        Despedida: "img/despedida.png",
        Matrimonio: "img/matrimonio.png",
        Ninguna: "img/default.png",
    };

    lista.forEach((reserva, indice) => {
        const estado = reserva.estadoReserva || "Pendiente";
        const imagen = imagenesOcasion[reserva.ocasionEspecial] || "img/default.png";
        
        const estaFinalizada = estado === "Finalizada";
        const estaCancelada = estado === "Cancelada";
        const esSoloLectura = estaFinalizada || estaCancelada;

        const divReserva = document.createElement("div");
        divReserva.classList.add("col-md-4");
        
        if (estaFinalizada) {
            divReserva.classList.add("reserva-finalizada");
        }
        if (estaCancelada) {
            divReserva.classList.add("reserva-cancelada");
        }
        
        divReserva.innerHTML = `
            <div class="card tarjeta-reserva ${esSoloLectura ? 'reserva-completada' : ''}">
                <img src="${imagen}" class="card-img-top" alt="${reserva.ocasionEspecial}">
                <div class="card-body">
                    <h5>${reserva.nombreCliente}</h5>
                    <p>📅 ${reserva.fechaReserva} ${reserva.horaReserva}</p>
                    <p>Mesa: 🍽️ ${reserva.idMesaAsignada}</p>
                    <p>Personas: 🧑‍🤝‍🧑 ${reserva.numeroPersonas}</p>
                    <p>Ocasión: ${reserva.ocasionEspecial || "N/A"}</p>
                    <p>Notas: ${reserva.NotasAdicionales || "Ninguna"}</p>
                    <p>⏳ Duración: ${reserva.duracionHoras > 0 ? reserva.duracionHoras : 2}h</p>
                    <p>Estado: <b class="estado-${estado.toLowerCase()}">${estado}</b></p>
                    <div class="mt-2 d-flex gap-1 flex-wrap">
                        <button class="btn btn-warning btn-sm" onclick="abrirEdicionReserva(${indice})" ${esSoloLectura ? "disabled" : ""}>Editar</button>
                        <button class="btn btn-success btn-sm" onclick="confirmarReserva(${indice})" ${estaFinalizada || estaCancelada ? "disabled" : ""}>Pagar</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${indice})" ${estaFinalizada || estaCancelada ? "disabled" : ""}>Cancelar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${indice})" ${!esSoloLectura ? "disabled" : ""}>Eliminar</button>
                
            </div>
        `;
        contenedorReservas.appendChild(divReserva);
    });
}

function hayConflictoReserva(nuevaReserva, indiceEditar = null) {
    const inicioNueva = new Date(`${nuevaReserva.fechaReserva}T${nuevaReserva.horaReserva}`);
    const finNueva = new Date(inicioNueva.getTime() + nuevaReserva.duracionHoras * 60 * 60 * 1000);

    return listaReservas.some((reserva, i) => {
        if (i === indiceEditar) return false;
        if (!reserva.idMesaAsignada) return false;
        if (reserva.idMesaAsignada !== nuevaReserva.idMesaAsignada) return false;
        if (reserva.estadoReserva === "Cancelada" || reserva.estadoReserva === "Finalizada") return false;

        const inicioExistente = new Date(`${reserva.fechaReserva}T${reserva.horaReserva}`);
        const finExistente = new Date(inicioExistente.getTime() + (reserva.duracionHoras || 2) * 60 * 60 * 1000);

        return inicioNueva < finExistente && finNueva > inicioExistente;
    });
}

function cargarMesasDisponibles(fecha, hora, duracion, indiceReservaEditar = null) {
    const selectMesas = document.getElementById("selectMesasDisponibles");
    const inputPersonas = document.getElementById("inputNumeroPersonas");
    
    if (!selectMesas) return;
    
    if (!fecha || !hora) {
        selectMesas.innerHTML = `<option value="">Selecciona fecha y hora primero</option>`;
        if (inputPersonas) inputPersonas.disabled = true;
        return;
    }
    
    selectMesas.innerHTML = "";
    let hayMesasDisponibles = false;

    listaMesas.forEach((m) => {
        if (m.estadoMesa === "disponible" && 
            estaMesaDisponibleEnHorario(m, fecha, hora, duracion, indiceReservaEditar)) {
            
            let option = document.createElement("option");
            option.value = m.ubicacionMesa;
            option.textContent = `${m.ubicacionMesa} - Capacidad ${m.capacidadMesa}`;
            option.setAttribute("data-capacidad", m.capacidadMesa);
            selectMesas.appendChild(option);
            hayMesasDisponibles = true;
        }
    });

    if (!hayMesasDisponibles) {
        selectMesas.innerHTML = `<option value="">No hay mesas disponibles en este horario</option>`;
        if (inputPersonas) inputPersonas.disabled = true;
    } else {
        if (inputPersonas) inputPersonas.disabled = false;
        actualizarMaximoPersonas();
    }
}

function actualizarMaximoPersonas() {
    const selectMesas = document.getElementById("selectMesasDisponibles");
    const inputPersonas = document.getElementById("inputNumeroPersonas");
    
    if (selectMesas && inputPersonas && selectMesas.selectedIndex >= 0) {
        const selectedOption = selectMesas.options[selectMesas.selectedIndex];
        const capacidad = parseInt(selectedOption.getAttribute("data-capacidad"));
        
        if (parseInt(inputPersonas.value || 0) > capacidad) {
            inputPersonas.value = capacidad;
        }
    }
}

function actualizarMesasDisponibles() {
    const fecha = document.getElementById("inputFechaReserva").value;
    const hora = document.getElementById("inputHoraReserva").value;
    const duracion = parseInt(document.getElementById("inputDuracion").value) || 2;
    const indiceReserva = document.getElementById("indiceReserva").value;

    const fechaUsar = fecha || new Date().toISOString().split('T')[0];
    const horaUsar = hora || '12:00';
    
    if (fechaUsar && horaUsar) {
        cargarMesasDisponibles(fechaUsar, horaUsar, duracion, indiceReserva ? parseInt(indiceReserva) : null);
    }
}

document.getElementById("btnAgregarReserva").addEventListener("click", () => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];
    const horaActual = hoy.getHours().toString().padStart(2, '0') + ':' + hoy.getMinutes().toString().padStart(2, '0');
    
    document.getElementById("formularioReserva").reset();
    
    document.getElementById("inputFechaReserva").value = fechaHoy;
    document.getElementById("inputHoraReserva").value = horaActual;
    document.getElementById("inputDuracion").value = 2;
    
    document.getElementById("indiceReserva").value = "";
    document.getElementById("grupoEstadoReserva").classList.add("d-none");

    actualizarMesasDisponibles();
    
    const modal = new bootstrap.Modal(document.getElementById("modalReserva"), {
    backdrop: 'static',
    keyboard: false
});
modal.show();

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
    let duracionHoras = parseInt(document.getElementById("inputDuracion").value) || 2;
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
    if (h < 8 || h > 23 || (h === 23 && m > 0)) {
        Swal.fire("Error", "La hora debe estar entre 08:00a.m y 11:00p.m.", "error");
        return;
    }

    if (duracionHoras < 1) duracionHoras = 1;

    const mesa = listaMesas.find((m) => m.ubicacionMesa === idMesaAsignada);
    if (!mesa) {
        Swal.fire("Error", "Mesa no válida seleccionada.", "error");
        return;
    }
    if (numeroPersonas > Number(mesa.capacidadMesa)) {
        Swal.fire(
            "Error",
            `La mesa ${mesa.ubicacionMesa} permite hasta ${mesa.capacidadMesa} personas.`,
            "error"
        );
        return;
    }

    if (!estaMesaDisponibleEnHorario(mesa, fechaReserva, horaReserva, duracionHoras, indice ? parseInt(indice) : null)) {
        Swal.fire("Error", "La mesa seleccionada ya no está disponible en este horario. Por favor, elige otra.", "error");
        cargarMesasDisponibles(fechaReserva, horaReserva, duracionHoras, indice ? parseInt(indice) : null);
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
        estadoReserva,
        duracionHoras,
    };

    const indiceEditar = indice ? parseInt(indice) : null;
    if (hayConflictoReserva(nuevaReserva, indiceEditar)) {
        Swal.fire(
            "Error",
            `La mesa ${idMesaAsignada} tiene otra reserva en ese horario (choque).`,
            "error"
        );
        return;
    }

    if (indice) {
        listaReservas[indiceEditar] = nuevaReserva;
    } else {
        listaReservas.push(nuevaReserva);
    }

    guardarListaReservas();

    Swal.fire("Éxito", "Reserva guardada correctamente", "success").then(() => {
        bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();
        mostrarReservas();
    });
   
    const mensaje = indice ? "¡Reserva editada correctamente!" : "¡Reserva guardada correctamente!";
    const texto = indice ? "La reserva fue editada correctamente." : "La reserva fue registrada correctamente.";

    Swal.fire({
        icon: "success",
        title: mensaje,
        text: texto,
        confirmButtonText: "Aceptar"
    }).then(() => {
        bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();
        mostrarReservas();
    });
});

function abrirEdicionReserva(indice) {
    const reserva = listaReservas[indice];
    document.getElementById("indiceReserva").value = indice;
    document.getElementById("inputNombreCliente").value = reserva.nombreCliente;
    document.getElementById("inputNumeroPersonas").value = reserva.numeroPersonas;
    document.getElementById("inputFechaReserva").value = reserva.fechaReserva;
    document.getElementById("inputHoraReserva").value = reserva.horaReserva;
    document.getElementById("selectOcasiones").value = reserva.ocasionEspecial;
    document.getElementById("StringNotasAdicionales").value = reserva.NotasAdicionales;
    document.getElementById("inputDuracion").value = reserva.duracionHoras || 2;

    cargarMesasDisponibles(reserva.fechaReserva, reserva.horaReserva, reserva.duracionHoras || 2, indice);
    
    setTimeout(() => {
        document.getElementById("selectMesasDisponibles").value = reserva.idMesaAsignada;
        actualizarMaximoPersonas();
    }, 100);

    document.getElementById("grupoEstadoReserva").classList.remove("d-none");
    document.getElementById("selectEstadoReserva").value = reserva.estadoReserva;

    const modal = new bootstrap.Modal(document.getElementById("modalReserva"), {
    backdrop: 'static',
    keyboard: false
    });
    modal.show();

}

function cancelarReserva(indice) {
    listaReservas[indice].estadoReserva = "Cancelada";
    guardarListaReservas();
    mostrarReservas();
    Swal.fire("Cancelada", "La reserva ha sido cancelada.", "success");
}

function confirmarReserva(indice) {
    listaReservas[indice].estadoReserva = "Finalizada";
    guardarListaReservas();
    mostrarReservas();
    Swal.fire("Éxito", "La reserva ha sido finalizada y la mesa está disponible nuevamente.", "success");
}

function eliminarReserva(indice) {
    const reserva = listaReservas[indice];
    const estado = reserva.estadoReserva || "Pendiente";
    
    if (estado !== "Finalizada" && estado !== "Cancelada") {
        Swal.fire({
            title: "No se puede eliminar",
            text: "Solo puedes eliminar reservas que estén Finalizadas o Canceladas",
            icon: "error",
            confirmButtonText: "Entendido"
        });
        return;
    }

    Swal.fire({
        title: "¿Eliminar reserva?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            listaReservas.splice(indice, 1);
            guardarListaReservas();
            mostrarReservas();
            Swal.fire("Eliminada", "La reserva ha sido eliminada", "success");
        }
    });
}

function filtrarReservas() {
    const filtroFecha = document.getElementById("filtroFecha").value;
    const filtroEstado = document.getElementById("filtroEstado").value;
    let reservasFiltradas = listaReservas;

    if (filtroFecha) {
        reservasFiltradas = reservasFiltradas.filter(
            (r) => r.fechaReserva === filtroFecha
        );
    }
    if (filtroEstado) {
        reservasFiltradas = reservasFiltradas.filter(
            (r) => r.estadoReserva === filtroEstado
        );
    }
    mostrarReservas(reservasFiltradas);
}

function actualizarEstadosAutomaticos() {
    const ahora = new Date();

    listaReservas.forEach((reserva, i) => {
        if (reserva.estadoReserva === "Pendiente") {
            const inicio = new Date(`${reserva.fechaReserva}T${reserva.horaReserva}`);
            const fin = new Date(
                inicio.getTime() + (reserva.duracionHoras || 2) * 60 * 60 * 1000
            );

            if (ahora > fin) {
                listaReservas[i].estadoReserva = "Finalizada";
            }
        }
    });

    guardarListaReservas();
    mostrarReservas();
}

document.getElementById("inputFechaReserva")?.addEventListener("change", actualizarMesasDisponibles);
document.getElementById("inputHoraReserva")?.addEventListener("change", actualizarMesasDisponibles);
document.getElementById("inputDuracion")?.addEventListener("change", actualizarMesasDisponibles);
document.getElementById("selectMesasDisponibles")?.addEventListener("change", actualizarMaximoPersonas);

document.addEventListener("DOMContentLoaded", () => {
    listaMesas = JSON.parse(localStorage.getItem("listaMesas")) || [];
    
    mostrarReservas();

const mesaSeleccionada = JSON.parse(localStorage.getItem("mesaSeleccionada"));

if (mesaSeleccionada) {
    const formulario = document.getElementById("formularioReserva");
    if (formulario) formulario.reset();
    const indiceInput = document.getElementById("indiceReserva");
    if (indiceInput) indiceInput.value = "";
    const grupoEstado = document.getElementById("grupoEstadoReserva");
    if (grupoEstado) grupoEstado.classList.add("d-none");

    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];
    const horaActual = hoy.getHours().toString().padStart(2, '0') + ':' + hoy.getMinutes().toString().padStart(2, '0');
    
    document.getElementById("inputFechaReserva").value = fechaHoy;
    document.getElementById("inputHoraReserva").value = horaActual;

    actualizarMesasDisponibles();
    
    setTimeout(() => {
        const select = document.getElementById("selectMesasDisponibles");
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === mesaSeleccionada.ubicacionMesa) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
        const inputPersonas = document.getElementById("inputNumeroPersonas");
        if (inputPersonas.value > mesaSeleccionada.capacidadMesa) {
            inputPersonas.value = mesaSeleccionada.capacidadMesa;
        }

        const modalEl = document.getElementById("modalReserva");
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl, {
                backdrop: 'static',
                keyboard: false
            });
            modal.show();
        }

        localStorage.removeItem("mesaSeleccionada");
    }, 100);
}


    const filtroFecha = document.getElementById("filtroFecha");
    if (filtroFecha) filtroFecha.addEventListener("change", filtrarReservas);
    const filtroEstado = document.getElementById("filtroEstado");
    if (filtroEstado) filtroEstado.addEventListener("change", filtrarReservas);

    actualizarEstadosAutomaticos();
    setInterval(actualizarEstadosAutomaticos, 60000);
}); 
