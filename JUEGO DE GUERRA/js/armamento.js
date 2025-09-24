const armamentoData = [
  {
    id: 1,
    nombre: "Fusil de Asalto AK-47",
    tipo: "rifle",
    embedUrl: "https://sketchfab.com/3d-models/ak47-26607752e079407b804025849ec5264c/embed?autostart=1&preload=1"   ,
    poderFuego: 85,
    alcance: 70,
    cadencia: 75,
    descripcion:
      "Fusil de asalto estándar de las fuerzas especiales. Preciso y confiable en cualquier condición de combate.",
  },
  {
    id: 3,
    nombre: "Escopeta Combat 12",
    tipo: "shotgun",
    embedUrl: "https://sketchfab.com/3d-models/escopeta-recortada-c224c03f22004d2ea18152759cc68e03/embed?autostart=1&preload=1",
    poderFuego: 90,
    alcance: 40,
    cadencia: 45,
    descripcion:
      "Escopeta de combate semiautomática. Devastadora en distancias cortas y espacios confinados.",
  },
  {
    id: 4,
    nombre: "Lanzagranadas M79",
    tipo: "explosive",
    embedUrl: "https://sketchfab.com/3d-models/m79-grenade-launcher-a05bb925909f4e3f8e6f5353a91d2215/embed?autostart=1&preload=1",
    poderFuego: 88,
    alcance: 65,
    cadencia: 20,
    descripcion:
      "Lanzagranadas de un solo disparo. Efectivo contra grupos de enemigos y vehículos ligeros.",
  },
  {
    id: 6,
    nombre: "Rifle de Precisión M24",
    tipo: "sniper",
    embedUrl: "https://sketchfab.com/3d-models/m24-aaa-game-ready-pbr-low-poly-3d-model-286e78a871a541e6bb05474968a4aef6/embed?autostart=1&preload=1",
    poderFuego: 87,
    alcance: 92,
    cadencia: 35,
    descripcion:
      "Rifle de precisión para francotiradores. Silencioso y extremadamente preciso a media y larga distancia.",
  },
];

function renderArmamento(armas) {
  const armamentoGrid = document.querySelector(".armamento-grid");
  if (!armamentoGrid) return;

  armamentoGrid.innerHTML = "";

  armas.forEach((arma) => {
    const armaCard = document.createElement("div");
    armaCard.className = "arma-card";

    armaCard.innerHTML = `
      <div class="arma-image">
        ${
          arma.embedUrl
            ? `<div style="position:relative;width:100%;padding-top:56.25%;">
                <iframe src="${arma.embedUrl}" 
                  title="${arma.nombre}" 
                  frameborder="0" 
                  allow="autoplay; fullscreen; xr-spatial-tracking" 
                  mozallowfullscreen="true" 
                  webkitallowfullscreen="true"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                  allowfullscreen>
                </iframe>
              </div>`
            : `<img src="${arma.imagen}" alt="${arma.nombre}">`
        }
        <span class="arma-type">${arma.tipo}</span>
      </div>
      <div class="arma-content">
        <h3 class="arma-name">${arma.nombre}</h3>
        <div class="arma-stats">
          <div class="stat">
            <span class="stat-label">Poder de Fuego</span>
            <span class="stat-value">${arma.poderFuego}%</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width:${arma.poderFuego}%"></div>
            </div>
          </div>
          <div class="stat">
            <span class="stat-label">Alcance</span>
            <span class="stat-value">${arma.alcance}%</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width:${arma.alcance}%"></div>
            </div>
          </div>
          <div class="stat">
            <span class="stat-label">Cadencia</span>
            <span class="stat-value">${arma.cadencia}%</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width:${arma.cadencia}%"></div>
            </div>
          </div>
          <div class="stat">
            <span class="stat-label">Estabilidad</span>
            <span class="stat-value">${100 - arma.cadencia / 2}%</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width:${100 - arma.cadencia / 2}%"></div>
            </div>
          </div>
        </div>
        <p class="arma-description">${arma.descripcion}</p>
      </div>
    `;

    armamentoGrid.appendChild(armaCard);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  renderArmamento(armamentoData);

  const typeFilter = document.getElementById("type-filter");
  const sortFilter = document.getElementById("sort-filter");
  const searchBox = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box button");

  if (typeFilter) {
    typeFilter.addEventListener("change", filterArmamento);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", filterArmamento);
  }

  if (searchButton) {
    searchButton.addEventListener("click", filterArmamento);
  }

  if (searchBox) {
    searchBox.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        filterArmamento();
      }
    });
  }

  function filterArmamento() {
    let filtered = [...armamentoData];

    const typeValue = typeFilter ? typeFilter.value : "all";
    if (typeValue !== "all") {
      filtered = filtered.filter((arma) => arma.tipo === typeValue);
    }

    const searchValue = searchBox ? searchBox.value.toLowerCase() : "";
    if (searchValue) {
      filtered = filtered.filter(
        (arma) =>
          arma.nombre.toLowerCase().includes(searchValue) ||
          arma.descripcion.toLowerCase().includes(searchValue)
      );
    }

    const sortValue = sortFilter ? sortFilter.value : "power";
    switch (sortValue) {
      case "power":
        filtered.sort((a, b) => b.poderFuego - a.poderFuego);
        break;
      case "range":
        filtered.sort((a, b) => b.alcance - a.alcance);
        break;
      case "rate":
        filtered.sort((a, b) => b.cadencia - a.cadencia);
        break;
    }

    renderArmamento(filtered);
  }
});
