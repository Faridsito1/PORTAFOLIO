    const urlParams = new URLSearchParams(window.location.search);
    const character = urlParams.get('character');

    const charactersData = {
      operations: {
        name: 'OPERATIONS OFFICER',
        subtitle: 'Lead tactical missions and coordinate strikes.',
        modelId: '8dbdde01dbac42638230074dc55e6f5d',
        missions: 9,
        activeOrder: 'TACTICAL COMMANDER',
        orderDesc: 'Complete 5 tactical objectives in Operations mode.',
        reward: 'Elite Operations Supply Drop'
      },
      quartermaster: {
        name: 'QUARTERMASTER',
        subtitle: 'Get supplied and get back in the fight.',
        modelId: 'ad6464eba6424b51966a5538435c2020',
        missions: 9,
        activeOrder: 'SUPPLY MASTER',
        orderDesc: 'Distribute 10 supply crates to teammates.',
        reward: '3 Rare Supply Drops'
      },
      mail: {
        name: 'MAIL OFFICER',
        subtitle: 'Deliver crucial messages and intelligence.',
        modelId: '51873daadd1544958419fb8ead3ab384',
        missions: 9,
        activeOrder: 'MESSAGE RUNNER',
        orderDesc: 'Successfully deliver 15 intel packages.',
        reward: 'Special Communication Badge'
      },
      headquarters: {
        name: 'HEADQUARTERS',
        subtitle: 'Command central operations and strategy.',
        modelId: 'db5db39deb74470292f8f1647c6c7bec',
        missions: 9,
        activeOrder: 'COMMAND CENTER',
        orderDesc: 'Win 3 matches while commanding from HQ.',
        reward: 'HQ Commander Emblem'
      },
    };

    if (character && charactersData[character]) {
      const data = charactersData[character];
      document.getElementById('char-name').textContent = data.name;
      document.getElementById('char-subtitle').textContent = data.subtitle;
      document.querySelector('.order-title').textContent = data.activeOrder;
      document.querySelector('.order-description').textContent = data.orderDesc;
      document.querySelector('.reward-text').textContent = data.reward;

      const iframe = document.getElementById('character-model');
      iframe.src = `https://sketchfab.com/models/${data.modelId}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0`;

      iframe.addEventListener('load', function () {
        document.getElementById('model-loading').style.display = 'none';
      });
    }

    function goBack() {
      window.location.href = 'personajes.html';
    }

    function abandonOrders() {
      const urlParams = new URLSearchParams(window.location.search);
      const character = urlParams.get('character');
      window.location.href = 'vehiculos.html?character=' + character;
    }

    function updateCountdown() {
      const countdownEl = document.querySelector('.order-countdown');
    }

    setInterval(updateCountdown, 1000);

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