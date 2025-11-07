    const urlParams = new URLSearchParams(window.location.search);
    const vehicle = urlParams.get('vehicle');

    const vehiclesData = {
      sherman: {
        name: 'M4 SHERMAN',
        subtitle: 'American Medium Tank',
        modelId: '0cb48b1752954a2897a9bdcc463aba22',
        armor: '7/10',
        speed: '6/10',
        firepower: '8/10',
        crew: '5',
        armament: 'MAIN ARMAMENT',
        armamentDesc: '75mm M3 Gun with excellent accuracy and penetration against medium armor.',
        stats: {
          penetration: 80,
          mobility: 70,
          rof: 65
        }
      },
      tiger: {
        name: 'TIGER I',
        subtitle: 'German Heavy Tank',
        modelId: '976a33d150b14804bad6e2627127dd92',
        armor: '10/10',
        speed: '4/10',
        firepower: '10/10',
        crew: '5',
        armament: 'MAIN ARMAMENT',
        armamentDesc: '88mm KwK 36 L/56 Gun. Legendary firepower capable of destroying any allied tank.',
        stats: {
          penetration: 95,
          mobility: 45,
          rof: 50
        }
      },
      jeep: {
        name: 'WILLYS JEEP',
        subtitle: 'Allied Light Vehicle',
        modelId: '77543b9887984e6cb1660b40ae899bf8',
        armor: '2/10',
        speed: '10/10',
        firepower: '3/10',
        crew: '2',
        armament: 'MOUNTED WEAPON',
        armamentDesc: '.30 Caliber M1919 Browning machine gun for infantry suppression.',
        stats: {
          penetration: 15,
          mobility: 95,
          rof: 85
        }
      },
      halftrack: {
        name: 'M3 HALFTRACK',
        subtitle: 'Armored Personnel Carrier',
        modelId: 'd0fe983198844ccbb169ec8b1ed4dfda',
        armor: '5/10',
        speed: '7/10',
        firepower: '5/10',
        crew: '3+10',
        armament: 'SUPPORT ARMAMENT',
        armamentDesc: '.50 Caliber M2 Browning heavy machine gun with 360° traverse capability.',
        stats: {
          penetration: 30,
          mobility: 75,
          rof: 70
        }
      }
    };

    if (vehicle && vehiclesData[vehicle]) {
      const data = vehiclesData[vehicle];
      document.getElementById('vehicle-name').textContent = data.name;
      document.getElementById('vehicle-subtitle').textContent = data.subtitle;
      document.getElementById('armor-value').textContent = data.armor;
      document.getElementById('speed-value').textContent = data.speed;
      document.getElementById('firepower-value').textContent = data.firepower;
      document.getElementById('crew-value').textContent = data.crew;
      document.getElementById('loadout-title').textContent = data.armament;
      document.getElementById('loadout-desc').textContent = data.armamentDesc;
      
      document.querySelectorAll('.stat-bar-fill')[0].style.width = data.stats.penetration + '%';
      document.querySelectorAll('.stat-bar-value')[0].textContent = data.stats.penetration + '%';
      
      document.querySelectorAll('.stat-bar-fill')[1].style.width = data.stats.mobility + '%';
      document.querySelectorAll('.stat-bar-value')[1].textContent = data.stats.mobility + '%';
      
      document.querySelectorAll('.stat-bar-fill')[2].style.width = data.stats.rof + '%';
      document.querySelectorAll('.stat-bar-value')[2].textContent = data.stats.rof + '%';
      
      const iframe = document.getElementById('vehicle-model');
      iframe.src = `https://sketchfab.com/models/${data.modelId}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0`;
      
      iframe.addEventListener('load', function() {
        document.getElementById('model-loading').style.display = 'none';
      });
    }

    function goBack() {
      const urlParams = new URLSearchParams(window.location.search);
      const character = urlParams.get('character');
      window.location.href = 'vehiculos.html?character=' + character;
    }

    function startMatch() {
    const urlParams = new URLSearchParams(window.location.search);
    const character = urlParams.get('character');
    const vehicle = urlParams.get('vehicle');
    window.location.href = 'cinematica.html?character=' + character + '&vehicle=' + vehicle;
    }

  document.addEventListener('DOMContentLoaded', function() {
    const originalLocation = window.location.href;
    
    window.originalNavigation = {
      backToMenu: window.backToMenu,
      selectCharacter: window.selectCharacter
    };

    window.navigateWithTransition = function(url) {
      document.body.classList.add('fade-out');
      setTimeout(function() {
        window.location.href = url;
      }, 600);
    };

    if (typeof backToMenu !== 'undefined') {
      window.backToMenu = function() {
        navigateWithTransition('menu.html');
      };
    }

    if (typeof selectCharacter !== 'undefined') {
      window.selectCharacter = function(character) {
        navigateWithTransition('detallesPersonajes.html?character=' + character);
      };
    }

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        const onclickAttr = this.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('window.location.href')) {
          e.preventDefault();
          e.stopPropagation();
          const url = onclickAttr.match(/'([^']+)'/)[1];
          navigateWithTransition(url);
        }
      });
    });
  });