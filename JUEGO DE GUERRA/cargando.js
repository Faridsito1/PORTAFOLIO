    const fullText = "Call of Duty regresa a sus raíces con Call of Duty: WWII - una experiencia impresionante que redefine la Segunda Guerra Mundial para una nueva generación de jugadores. Aterriza en Normandía el Día D y lucha a través de Europa en las ubicaciones más icónicas de la guerra más monumental de la historia. Experimenta el combate clásico de Call of Duty, los lazos de camaradería y la naturaleza implacable de la guerra.";
    
    let charIndex = 0;
    let loadingProgress = 0;
    const typewriterElement = document.getElementById('typewriter');
    const loadingBar = document.getElementById('loadingBar');
    const percentageElement = document.getElementById('percentage');

    function typeWriter() {
      if (charIndex < fullText.length) {
        typewriterElement.innerHTML = fullText.substring(0, charIndex + 1) + '<span class="cursor"></span>';
        charIndex++;
        setTimeout(typeWriter, 30);
      } else {
        typewriterElement.innerHTML = fullText;
      }
    }

    function updateLoadingBar() {
      if (loadingProgress < 100) {
        loadingProgress += Math.random() * 3;
        if (loadingProgress > 100) loadingProgress = 100;
        
        loadingBar.style.width = loadingProgress + '%';
        percentageElement.textContent = Math.floor(loadingProgress) + '%';
        
        setTimeout(updateLoadingBar, 100);
      } else {
        setTimeout(() => {
          window.location.href = 'personajes.html';
        }, 500);
      }
    }

    setTimeout(() => {
      typeWriter();
      updateLoadingBar();
    }, 500);