const apiKey = 'RqlBxUTPSvYb_zLIBnzVTJkbLzpUXrv4py3pE4rECMs';
const apiUrl = `https://api.unsplash.com/photos/random?count=12&client_id=${apiKey}`;

function searchImages() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value;

    let searchApiUrl;

    if (searchTerm.trim() !== '') {
        searchApiUrl = `https://api.unsplash.com/photos/random?count=12&query=${searchTerm}&client_id=${apiKey}`;
    } else {
        searchApiUrl = apiUrl;
    }

    fetchImages(searchApiUrl);
}

async function fetchImages(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const galleryElement = document.getElementById('gallery');
        galleryElement.innerHTML = ''; // Limpiar galería antes de agregar nuevas imágenes

        // Crear un contenedor para las filas
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        // Dividir las imágenes en 3 columnas
        const columns = [[], [], []];
        data.forEach((photo, index) => {
            columns[index % 3].push(photo); // Distribuir imágenes entre las 3 columnas
        });

        // Crear las columnas y agregar las imágenes
        columns.forEach(colImages => {
            const colElement = document.createElement('div');
            colElement.classList.add('col-lg-4', 'col-md-6', 'mb-4'); // Clases para columnas

            colImages.forEach(photo => {
                const imgElement = document.createElement('img');
                imgElement.src = photo.urls.small;
                imgElement.alt = photo.alt_description || 'Sin descripción';
                imgElement.classList.add('w-100', 'shadow-1-strong', 'rounded', 'mb-4'); // Estilo Bootstrap

                // Evento para mostrar información al hacer clic
                imgElement.addEventListener('click', () => {
                    displayImageInfo(photo);
                });

                colElement.appendChild(imgElement);
            });

            rowElement.appendChild(colElement);
        });

        // Agregar la fila completa al contenedor principal
        galleryElement.appendChild(rowElement);
    } catch (error) {
        console.error('Error al cargar imágenes:', error);
    }
}


function displayImageInfo(photo) {
    const modalContent = `
        <div class="modal">
            <img src="${photo.urls.full}" alt="${photo.alt_description}" />
            <p>Resolución: ${photo.width} x ${photo.height}</p>
            <p>Likes: ${photo.likes}</p>
            <p>Fotógrafo: ${photo.user.name}</p>
            <button class="btn btn-primary" onclick="downloadImage('${photo.urls.full}', '${photo.alt_description}')">Descargar</button>
            <span class="close" onclick="closeModal()">&times;</span>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

fetchImages(apiUrl);