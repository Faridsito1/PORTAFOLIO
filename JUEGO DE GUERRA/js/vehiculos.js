const vehiculosData = [
  {
    id: 1,
    nombre: "Tanque Predator X7",
    tipo: "tank",
    imagen:"https://sketchfab.com/3d-models/tanque-de-guerra-elvas-df3b40da7e7a40e8944f18cf4e6a6b73/embed?autostart=1&preload=1",
    blindaje: 95,
    velocidad: 60,
    fuego: 90,
    descripcion:
      "Tanque de batalla principal con blindaje compuesto reactivo y cañón de 120mm. La columna vertebral de cualquier ofensiva terrestre.",
    especificaciones: [
      "Tripulación: 4 personas",
      "Autonomía: 450 km",
      "Peso: 62 toneladas",
    ],
  },
  {
    id: 2,
    nombre: "Transporte Blindado Bisonte",
    tipo: "apc",
    imagen:"https://sketchfab.com/3d-models/btr-80a-apc-armored-personnel-carrier-35994a54db35492594f5fb2e0e9e5d17/embed?autostart=1&preload=1",
    blindaje: 80,
    velocidad: 85,
    fuego: 65,
    descripcion:
      "Vehículo blindado de transporte de personal con capacidad para 12 soldados. Equipado con torreta automática de 20mm.",
    especificaciones: [
      "Capacidad: 12 soldados",
      "Autonomía: 600 km",
      "Anfibio: Sí",
    ],
  },
  {
    id: 3,
    nombre: "Helicóptero de Ataque Halcón",
    tipo: "helicopter",
    imagen:"https://sketchfab.com/3d-models/boeing-ah-64d-apache-longbow-b135d7acaf0948f58538a8a6eeb9ec74/embed?autostart=1&preload=1",
    blindaje: 70,
    velocidad: 90,
    fuego: 85,
    descripcion:
      "Helicóptero de ataque con capacidad todo tiempo. Armado con cohetes, cañón rotativo y misiles antitanque.",
    especificaciones: [
      "Tripulación: 2 personas",
      "Alcance: 450 km",
      "Techo máximo: 6,100 m",
    ],
  },
  {
    id: 4,
    nombre: "Dron de Reconocimiento Spectre",
    tipo: "drone",
    imagen: "https://sketchfab.com/3d-models/mini-dron-ugv-e1328f6a1d1a43f3b29535b4340dfc97/embed?autostart=1&preload=1",
    blindaje: 30,
    velocidad: 95,
    fuego: 40,
    descripcion:
      "Vehículo aéreo no tripulado de vigilancia y reconocimiento. Capacidad de transmisión en tiempo real y seguimiento de objetivos.",
    especificaciones: [
      "Autonomía: 24 horas",
      "Envergadura: 5.2 m",
      "Carga útil: 50 kg",
    ],
  },
];

function renderVehiculos(vehiculos) {
  const vehiculosContainer = document.querySelector(".vehiculos-container");
  if (!vehiculosContainer) return;

  vehiculosContainer.innerHTML = "";

  vehiculos.forEach((vehiculo) => {
    const vehiculoCard = document.createElement("div");
    vehiculoCard.className = "vehiculo-card";

    vehiculoCard.innerHTML = `
            <div class="vehiculo-image">
    <iframe 
        title="${vehiculo.nombre}"
        frameborder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowfullscreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        src="${
          vehiculo.imagen
        }?autospin=0.2&autostart=1&ui_infos=0&ui_hint=0&ui_watermark=0">
    </iframe>
</div>

            <div class="vehiculo-content">
                <div class="vehiculo-header">
                    <h3 class="vehiculo-name">${vehiculo.nombre}</h3>
                    <span class="vehiculo-type">${vehiculo.tipo}</span>
                </div>
                <div class="vehiculo-stats">
                    <div class="vehiculo-stat">
                        <span class="stat-label">Blindaje</span>
                        <span class="stat-value">${vehiculo.blindaje}%</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${
                              vehiculo.blindaje
                            }%"></div>
                        </div>
                    </div>
                    <div class="vehiculo-stat">
                        <span class="stat-label">Velocidad</span>
                        <span class="stat-value">${vehiculo.velocidad}%</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${
                              vehiculo.velocidad
                            }%"></div>
                        </div>
                    </div>
                    <div class="vehiculo-stat">
                        <span class="stat-label">Poder de Fuego</span>
                        <span class="stat-value">${vehiculo.fuego}%</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${
                              vehiculo.fuego
                            }%"></div>
                        </div>
                    </div>
                </div>
                <p class="vehiculo-description">${vehiculo.descripcion}</p>
                <div class="vehiculo-specs">
                    ${vehiculo.especificaciones
                      .map(
                        (spec) => `
                        <div class="spec">
                            <span class="spec-icon">✓</span>
                            <span>${spec}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;

    vehiculosContainer.appendChild(vehiculoCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderVehiculos(vehiculosData);

  const typeFilter = document.getElementById("type-filter");
  const sortFilter = document.getElementById("sort-filter");

  if (typeFilter) {
    typeFilter.addEventListener("change", filterVehiculos);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", filterVehiculos);
  }

  function filterVehiculos() {
    let filtered = [...vehiculosData];

    const typeValue = typeFilter ? typeFilter.value : "all";
    if (typeValue !== "all") {
      filtered = filtered.filter((vehiculo) => vehiculo.tipo === typeValue);
    }

    const sortValue = sortFilter ? sortFilter.value : "armor";
    switch (sortValue) {
      case "armor":
        filtered.sort((a, b) => b.blindaje - a.blindaje);
        break;
      case "speed":
        filtered.sort((a, b) => b.velocidad - a.velocidad);
        break;
      case "firepower":
        filtered.sort((a, b) => b.fuego - a.fuego);
        break;
    }

    renderVehiculos(filtered);
  }
});
