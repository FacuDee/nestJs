document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-tracks');
  const resultado = document.getElementById('resultado');
  const obtenerDataBtn = document.getElementById('obtenerData');
  const tracksList = document.getElementById('tracks-list');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('title').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const duration = Number(document.getElementById('duration').value);

    // Validación simple
    if (!title || !artist || !duration) {
      resultado.textContent = 'Por favor, completa todos los campos.';
      resultado.style.color = 'red';
      return;
    }

    // Construir el objeto track
    const track = { title, duration, artist };

    try {
      const res = await fetch('http://localhost:3000/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(track)
      });

      if (!res.ok) {
        throw new Error('Error al guardar la canción');
      }

      const data = await res.json();
      resultado.textContent = `Canción "${data.title}" agregada correctamente.`;
      resultado.style.color = 'green';
      form.reset();
    } catch (error) {
      resultado.textContent = 'Ocurrió un error al guardar la canción.';
      resultado.style.color = 'red';
    }
  });

  // Obtener y mostrar tracks al hacer click en el botón
  obtenerDataBtn.addEventListener('click', async () => {
    tracksList.innerHTML = '';
    resultado.textContent = '';
    try {
      const res = await fetch('http://localhost:3000/tracks');
      if (!res.ok) throw new Error('No se pudo obtener la lista de canciones');
      const tracks = await res.json();
      if (tracks.length === 0) {
        tracksList.innerHTML = '<li>No hay canciones registradas.</li>';
        return;
      }
      tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = `${track.title} - ${track.artist} (${track.duration}seg.)`;
        tracksList.appendChild(li);
      });
    } catch (error) {
      resultado.textContent = 'Ocurrió un error al obtener las canciones.';
      resultado.style.color = 'red';
    }
  });
});