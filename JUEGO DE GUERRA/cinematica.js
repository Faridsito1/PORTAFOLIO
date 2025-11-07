    const urlParams = new URLSearchParams(window.location.search);
    const character = urlParams.get('character');
    const vehicle = urlParams.get('vehicle');

    const characterNames = {
      operations: 'OPERATIONS OFFICER',
      quartermaster: 'QUARTERMASTER',
      mail: 'MAIL OFFICER',
      headquarters: 'HEADQUARTERS'
    };

    const vehicleNames = {
      sherman: 'M4 SHERMAN',
      tiger: 'TIGER I',
      jeep: 'WILLYS JEEP',
      halftrack: 'M3 HALFTRACK'
    };

    if (character && characterNames[character]) {
      document.getElementById('char-display').textContent = characterNames[character];
    }

    if (vehicle && vehicleNames[vehicle]) {
      document.getElementById('vehicle-display').textContent = vehicleNames[vehicle];
    }

    setTimeout(() => {
      document.getElementById('loadingScreen').classList.add('hidden');
      document.getElementById('cinematic-video').muted = false;
    }, 3000);

    const video = document.getElementById('cinematic-video');
    video.addEventListener('ended', function() {
      endCinematic();
    });

    function skipCinematic() {
      endCinematic();
    }

    function endCinematic() {
      alert('Cinemática finalizada. Aquí comenzaría el juego.');
    }

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        skipCinematic();
      }
    });