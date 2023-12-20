const apiKey = 'RqlBxUTPSvYb_zLIBnzVTJkbLzpUXrv4py3pE4rECMs';
const apiUrl = `https://api.unsplash.com/photos/random?count=12&client_id=${apiKey}`;

function searchImages() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value;

    let searchApiUrl;

    if (searchTerm.trim() !== '') {
        searchApiUrl = `https://api.unsplash.com/photos/random?count=12&query=${searchTerm}&client_id=${apiKey}`;
    } else {
        // Si el campo de búsqueda está vacío, muestra imágenes aleatorias
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

        data.forEach(photo => {
            const imgElement = document.createElement('img');
            imgElement.src = photo.urls.small;
            imgElement.alt = photo.alt_description;

            // Agregar evento clic a la imagen
            imgElement.addEventListener('click', () => {
                displayImageInfo(photo);
            });

            galleryElement.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error al cargar imágenes:', error);
    }
}

async function downloadImage(imageUrl, imageName) {
    try {
        const response = await fetch(imageUrl, {
            headers: {
                Authorization: `Client-ID ${apiKey}`,
            },
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Crea un enlace temporal para descargar la imagen
            const link = document.createElement('a');
            link.href = url;
            link.download = imageName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Libera los recursos
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Error al descargar la imagen:', response.statusText);
        }
    } catch (error) {
        console.error('Error al descargar la imagen:', error);
    }
}

function displayImageInfo(photo) {
    const modalContent = `
        <div class="modal">
            <img src="${photo.urls.full}" alt="${photo.alt_description}" />
            <p>Resolución: ${photo.width} x ${photo.height}</p>
            <p>Escala: ${photo.likes}</p>
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

// Cargar imágenes aleatorias al inicio
fetchImages(apiUrl);
