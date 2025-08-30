let listaMesas = JSON.parse(localStorage.getItem("listaMesas")) || [];

function guardarListaMesas() {
    localStorage.setItem("listaMesas", JSON.stringify(listaMesas));
}

function mostrarMesas() {
    const contenedorMesas = document.getElementById("contenedorMesas");
    contenedorMesas.innerHTML = "";

    if (listaMesas.length === 0) {
        contenedorMesas.innerHTML = `<p class="text-center text-muted">No hay mesas registradas</p>`;
        return;
    }

    listaMesas.forEach((mesa, indice) => {
        let divMesa = document.createElement("div");
        divMesa.classList.add("col-md-3");
        divMesa.innerHTML = `
            <div class="card tarjeta-mesa estado-${mesa.estadoMesa}">
                <h5>${mesa.nombreMesa}</h5>
                <p>Capacidad: ${mesa.capacidadMesa}</p>
                <p>Ubicación: ${mesa.ubicacionMesa}</p>
                <p>Estado: ${mesa.estadoMesa}</p>
                <div class="mt-2">
                    <button class="btn btn-primary btn-sm" onclick="reservarMesa(${indice})">Reservar</button>
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
    new bootstrap.Modal(document.getElementById("modalMesa")).show();
});

document.getElementById("formularioMesa").addEventListener("submit", (e) => {
    e.preventDefault();

    const indice = document.getElementById("indiceMesa").value;
    const capacidad = document.getElementById("inputCapacidadMesa").value;
    const ubicacion = document.getElementById("selectUbicacion").value;
    const estado = document.getElementById("selectEstadoMesa").value;

    if (indice) {
        listaMesas[indice].capacidadMesa = capacidad;
        listaMesas[indice].ubicacionMesa = ubicacion;
        listaMesas[indice].estadoMesa = estado;
    } else {
        listaMesas.push({
            nombreMesa: `Mesa ${listaMesas.length + 1}`,
            capacidadMesa: capacidad,
            ubicacionMesa: ubicacion,
            estadoMesa: estado
        });
    }

    guardarListaMesas();
    mostrarMesas();

    Swal.fire({
        icon: "success",
        title: "¡Mesa guardada!",
        text: "La mesa fue registrada correctamente.",
        confirmButtonText: "Aceptar"
    });

    bootstrap.Modal.getInstance(document.getElementById("modalMesa")).hide();
    e.target.reset();
});

function reservarMesa(indice) {
    const mesa = listaMesas[indice];

    if (mesa.estadoMesa !== "disponible") {
        alert("Esta mesa no está disponible para reservar.");
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
    new bootstrap.Modal(document.getElementById("modalMesa")).show();
}

let mesaAEliminar = null;

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

document.addEventListener("DOMContentLoaded", mostrarMesas);


