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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(track),
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
      tracks.forEach((track) => {
        const li = document.createElement('li');

        // Texto del track
        const spanText = document.createElement('span');
        spanText.textContent = `${track.id}) ${track.title} - ${track.artist} (${track.duration}seg.) `;

        // Contenedor de iconos
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('icon-container');

        // Botón de editar (lápiz)
        const btnEdit = document.createElement('button');
        btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        btnEdit.title = 'Editar';
        btnEdit.classList.add('edit-btn');
        btnEdit.addEventListener('click', () => {
          openEditModal(track);
        });

        // Botón de papelera
        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btnDelete.title = 'Eliminar';
        btnDelete.classList.add('delete-btn');
        btnDelete.addEventListener('click', async () => {
          if (confirm(`¿Seguro que deseas eliminar "${track.title}"?`)) {
            try {
              const res = await fetch(
                `http://localhost:3000/tracks/${track.id}`,
                { method: 'DELETE' },
              );
              if (!res.ok) throw new Error('No se pudo eliminar la canción');
              li.remove();
              resultado.textContent = `Canción "${track.title}" eliminada correctamente.`;
              resultado.style.color = 'green';
            } catch (error) {
              resultado.textContent =
                'Ocurrió un error al eliminar la canción.';
              resultado.style.color = 'red';
            }
          }
        });

        // Agrega los botones al contenedor de iconos
        iconContainer.appendChild(btnEdit);
        iconContainer.appendChild(btnDelete);

        // Agrega el texto y el contenedor de iconos al li
        li.appendChild(spanText);
        li.appendChild(iconContainer);
        tracksList.appendChild(li);
      });
    } catch (error) {
      resultado.textContent = 'Ocurrió un error al obtener las canciones.';
      resultado.style.color = 'red';
    }
  });
  // Modal y formulario de edición
  const editModal = document.getElementById('edit-modal');
  const closeModal = document.getElementById('close-modal');
  const editForm = document.getElementById('edit-form');
  const editId = document.getElementById('edit-id');
  const editTitle = document.getElementById('edit-title');
  const editArtist = document.getElementById('edit-artist');
  const editDuration = document.getElementById('edit-duration');

  function openEditModal(track) {
    editId.value = track.id;
    editTitle.value = track.title;
    editArtist.value = track.artist;
    editDuration.value = track.duration;
    editModal.style.display = 'block';
  }

  closeModal.onclick = () => {
    editModal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == editModal) {
      editModal.style.display = 'none';
    }
  };

  editForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = editId.value;
    const updatedTrack = {
      id,
      title: editTitle.value,
      artist: editArtist.value,
      duration: Number(editDuration.value),
    };
    try {
      const res = await fetch(`http://localhost:3000/tracks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrack),
      });
      if (!res.ok) throw new Error('No se pudo editar la canción');
      editModal.style.display = 'none';
      obtenerDataBtn.click(); // Recarga la lista
      resultado.textContent = `Canción "${updatedTrack.title}" editada correctamente.`;
      resultado.style.color = 'green';
    } catch (error) {
      resultado.textContent = 'Ocurrió un error al editar la canción.';
      resultado.style.color = 'red';
    }
  };
});
