    function backToMenu() {
      window.location.href = 'menu.html';
    }

    function selectCharacter(character) {
      window.location.href = 'detallesPersonajes.html?character=' + character;
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