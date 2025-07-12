 const apiKey = '';
    const searchBaseUrl = 'https://api.unsplash.com/search/photos?per_page=12';
    const randomBaseUrl = 'https://api.unsplash.com/photos?per_page=12';
    let currentPage = 1;
    let currentQuery = '';
    let totalPages = 1;
    let isViewingFavorites = false;
    let currentZoom = 1;
    let currentPhoto = null;

    // Elementos del DOM
    const galleryEl = document.getElementById('gallery');
    const searchInputEl = document.getElementById('searchInput');
    const themeToggleEl = document.getElementById('themeToggle');
    const loadingSpinnerEl = document.getElementById('loadingSpinner');
    const prevBtnEl = document.getElementById('prevBtn');
    const nextBtnEl = document.getElementById('nextBtn');
    const pageInfoEl = document.getElementById('pageInfo');
    const modalContainerEl = document.getElementById('modalContainer');
    const modalPremiumEl = document.getElementById('modalPremium');
    const modalBackdropEl = document.getElementById('modalBackdrop');
    const showFavoritesBtnEl = document.getElementById('showFavoritesBtn');
    const favoritesBadgeEl = document.getElementById('favoritesBadge');

    // Inicialización
    window.addEventListener('DOMContentLoaded', () => {
      if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.navbar-premium').classList.add('dark-mode');
        themeToggleEl.innerHTML = '<i class="fas fa-sun"></i>';
      }
      updateFavoritesBadge();
      loadInitialImages();
    });

    // Event listeners
    themeToggleEl.addEventListener('click', toggleTheme);
    searchInputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchImages();
    });
    showFavoritesBtnEl.addEventListener('click', showFavorites);

    async function loadInitialImages() {
      await fetchRandomImages();
    }

    function searchTag(tag) {
      searchInputEl.value = tag;
      searchImages();
    }

    async function fetchRandomImages() {
      isViewingFavorites = false;
      const url = `${randomBaseUrl}&page=${currentPage}&client_id=${apiKey}`;
      await fetchImages(url, false);
    }

    async function showFavorites() {
      isViewingFavorites = true;
      currentPage = 1;
      const favs = JSON.parse(localStorage.getItem('favorites') || []);
      
      if (favs.length === 0) {
        showToast('No tienes imágenes favoritas guardadas', 'error');
        return;
      }
      
      await fetchFavorites(favs);
    }

    async function fetchFavorites(photoIds) {
      showLoading(true);
      galleryEl.innerHTML = '';
      
      try {
        // Paginación para favoritos
        const itemsPerPage = 12;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedIds = photoIds.slice(startIndex, endIndex);
        
        if (paginatedIds.length === 0) {
          galleryEl.innerHTML = `
            <div class="col-12 text-center py-5 text-white">
              <h4>No hay más imágenes favoritas para mostrar.</h4>
            </div>
          `;
          updatePagination(currentPage, Math.ceil(photoIds.length / itemsPerPage));
          return;
        }
        
        const promises = paginatedIds.map(id => 
          fetch(`https://api.unsplash.com/photos/${id}?client_id=${apiKey}`)
            .then(res => res.json())
            .catch(() => null)
        );
        
        const photos = (await Promise.all(promises)).filter(photo => photo !== null);
        
        displayPhotos(photos);
        updatePagination(currentPage, Math.ceil(photoIds.length / itemsPerPage));
      } catch (err) {
        console.error('Error al obtener favoritos:', err);
        showToast('Error al cargar favoritos', 'error');
      } finally {
        showLoading(false);
      }
    }

    async function searchImages() {
      isViewingFavorites = false;
      const query = searchInputEl.value.trim();
      currentQuery = query || currentQuery;
      currentPage = 1;
      
      if (!currentQuery) {
        await fetchRandomImages();
        return;
      }
      
      const url = `${searchBaseUrl}&query=${encodeURIComponent(currentQuery)}&page=${currentPage}&client_id=${apiKey}`;
      await fetchImages(url, true);
    }

    async function fetchImages(apiUrl, isSearch = true) {
      showLoading(true);
      galleryEl.innerHTML = '';
      
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        
        const json = await res.json();
        const photos = isSearch ? json.results : Array.isArray(json) ? json : [json];
        
        if (isSearch) {
          totalPages = json.total_pages || 1;
        } else {
          // Para imágenes aleatorias, asumimos un número alto de páginas
          totalPages = 25;
        }
        
        updatePagination(currentPage, totalPages);
        displayPhotos(photos);
      } catch (err) {
        console.error('Error al obtener imágenes:', err);
        showToast('Error al cargar imágenes', 'error');
      } finally {
        showLoading(false);
      }
    }

    function displayPhotos(photos) {
      galleryEl.innerHTML = '';
      
      if (photos.length === 0) {
        galleryEl.innerHTML = `
          <div class="col-12 text-center py-5 text-white">
            <h4>No se encontraron imágenes. Prueba con otra búsqueda.</h4>
          </div>
        `;
        return;
      }
      
      photos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item animate-pop';
        galleryItem.style.animationDelay = `${index * 0.05}s`;
        
        const img = document.createElement('img');
        img.src = photo.urls?.small || photo.urls?.regular;
        img.alt = photo.alt_description || 'Imagen sin descripción';
        img.className = 'gallery-img';
        img.loading = 'lazy';
        img.decoding = 'async';
        
        const overlay = document.createElement('div');
        overlay.className = 'img-overlay';
        overlay.innerHTML = `
          <div class="img-author">
            <img src="${photo.user?.profile_image?.small || 'https://via.placeholder.com/30'}" 
                 alt="${photo.user?.name || 'Autor'}" 
                 class="author-avatar">
            <p class="author-name">${photo.user?.name || 'Autor desconocido'}</p>
          </div>
          <div class="img-likes">
            <i class="fas fa-heart"></i> ${photo.likes.toLocaleString()} likes
          </div>
        `;
        
        img.onclick = () => displayImageInfo(photo);
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        galleryEl.appendChild(galleryItem);
      });
    }

    function displayImageInfo(photo) {
      currentPhoto = photo;
      const isDarkMode = document.body.classList.contains('dark-mode');
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFavorite = favs.includes(photo.id);
      
      // Mostrar loader mientras carga la imagen
      document.querySelector('.image-loader').style.display = 'flex';
      
      // Configurar imagen
      const modalImage = document.getElementById('modalImage');
      modalImage.src = photo.urls?.regular || photo.urls?.full;
      modalImage.alt = photo.alt_description || 'Imagen ampliada';
      modalImage.onload = () => {
        document.querySelector('.image-loader').style.display = 'none';
        resetZoom(); // Resetear zoom al cargar nueva imagen
      };
      
      // Configurar información básica
      document.getElementById('modalTitle').textContent = photo.alt_description || 'Detalles de la imagen';
      document.getElementById('resolutionInfo').textContent = `${photo.width} × ${photo.height} px`;
      document.getElementById('likesInfo').textContent = photo.likes.toLocaleString();
      document.getElementById('viewsInfo').textContent = (photo.views || 0).toLocaleString();
      document.getElementById('descriptionInfo').textContent = 
        photo.description || photo.alt_description || 'No hay descripción disponible';
      
      // Fecha de publicación
      if (photo.created_at) {
        const date = new Date(photo.created_at);
        document.getElementById('dateInfo').textContent = date.toLocaleDateString('es-ES', {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
      }
      
      // Información del usuario
      if (photo.user) {
        document.getElementById('userName').textContent = photo.user.name || 'Desconocido';
        document.getElementById('userBio').textContent = photo.user.bio || '-';
        document.getElementById('userLink').href = photo.user.links?.html || '#';
        
        const avatar = document.getElementById('userAvatar');
        if (photo.user.profile_image?.medium) {
          avatar.src = photo.user.profile_image.medium;
        }
      }
      
      // Configurar botón de favoritos
      const favoriteBtn = document.getElementById('favoriteBtn');
      favoriteBtn.innerHTML = isFavorite 
        ? '<i class="fas fa-heart"></i> Eliminar' 
        : '<i class="far fa-heart"></i> Guardar';
      favoriteBtn.className = isFavorite 
        ? 'btn btn-danger btn-favorite' 
        : 'btn btn-warning btn-favorite';
      
      // Mostrar tags
      const tagsContainer = document.getElementById('tagsContainer');
      tagsContainer.innerHTML = '';
      if (photo.tags && photo.tags.length > 0) {
        photo.tags.slice(0, 10).forEach(tag => {
          const tagEl = document.createElement('span');
          tagEl.className = 'tag';
          tagEl.textContent = typeof tag === 'object' ? tag.title : tag;
          tagsContainer.appendChild(tagEl);
        });
      } else {
        tagsContainer.innerHTML = '<span class="tag">Sin etiquetas</span>';
      }
      
      // Mostrar datos EXIF si están disponibles
      const exifData = document.getElementById('exifData');
      exifData.innerHTML = '';
      
      if (photo.exif) {
        const exifItems = [
          { label: 'Cámara', value: photo.exif.make ? `${photo.exif.make} ${photo.exif.model}` : null },
          { label: 'Apertura', value: photo.exif.aperture ? `f/${photo.exif.aperture}` : null },
          { label: 'Exposición', value: photo.exif.exposure_time || null },
          { label: 'Focal', value: photo.exif.focal_length ? `${photo.exif.focal_length}mm` : null },
          { label: 'ISO', value: photo.exif.iso || null },
          { label: 'Dimensiones', value: `${photo.width} × ${photo.height} px` }
        ];
        
        exifItems.forEach(item => {
          if (item.value) {
            const exifItem = document.createElement('div');
            exifItem.className = 'exif-item';
            exifItem.innerHTML = `<span class="exif-label">${item.label}:</span> ${item.value}`;
            exifData.appendChild(exifItem);
          }
        });
      }
      
      // Configurar tema del modal
      if (isDarkMode) {
        modalPremiumEl.classList.add('dark-mode');
      } else {
        modalPremiumEl.classList.remove('dark-mode');
      }
      
      // Mostrar modal con animación
      modalContainerEl.style.display = 'flex';
      setTimeout(() => {
        modalPremiumEl.classList.add('show');
      }, 10);
      
      document.body.style.overflow = 'hidden';
    }
    
    function zoomImage(amount) {
      currentZoom += amount;
      currentZoom = Math.max(0.5, Math.min(currentZoom, 3)); // Limitar zoom entre 0.5x y 3x
      document.getElementById('modalImage').style.transform = `scale(${currentZoom})`;
    }
    
    function resetZoom() {
      currentZoom = 1;
      document.getElementById('modalImage').style.transform = 'scale(1)';
    }
    
    function downloadImage() {
      if (!currentPhoto) return;
      
      const link = document.createElement('a');
      link.href = currentPhoto.links?.download || currentPhoto.urls?.full;
      link.download = `unsplash-${currentPhoto.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Descarga iniciada', 'success');
    }
    
    function toggleFavorite() {
      if (!currentPhoto) return;
      
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFavorite = favs.includes(currentPhoto.id);
      const favoriteBtn = document.getElementById('favoriteBtn');
      
      if (isFavorite) {
        // Eliminar de favoritos
        const newFavs = favs.filter(id => id !== currentPhoto.id);
        localStorage.setItem('favorites', JSON.stringify(newFavs));
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Guardar';
        favoriteBtn.className = 'btn btn-warning btn-favorite';
        showToast('Imagen eliminada de favoritos', 'error');
      } else {
        // Agregar a favoritos
        favs.push(currentPhoto.id);
        localStorage.setItem('favorites', JSON.stringify(favs));
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Eliminar';
        favoriteBtn.className = 'btn btn-danger btn-favorite';
        showToast('Imagen guardada en favoritos', 'success');
      }
      
      updateFavoritesBadge();
      
      // Si estamos viendo favoritos, actualizar la vista
      if (isViewingFavorites) {
        showFavorites();
      }
    }
    
    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast-notification ${type}`;
      toast.innerHTML = `
        <span class="toast-icon">
          ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>'}
        </span>
        <span>${message}</span>
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }
    
    function closeModal() {
      const modal = document.getElementById('modalPremium');
      modal.classList.remove('show');
      
      setTimeout(() => {
        modalContainerEl.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }

   function updateFavoritesBadge() {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const badge = document.getElementById('favorites-badge');
  if (badge) badge.textContent = favs.length;
}

    function nextPage() {
      if (currentPage < totalPages) {
        currentPage++;
        updateImages();
      }
    }

    function prevPage() {
      if (currentPage > 1) {
        currentPage--;
        updateImages();
      }
    }

    function updateImages() {
      if (isViewingFavorites) {
        const favs = JSON.parse(localStorage.getItem('favorites') || []);
        fetchFavorites(favs);
      } else if (!currentQuery) {
        fetchRandomImages();
      } else {
        const url = `${searchBaseUrl}&query=${encodeURIComponent(currentQuery)}&page=${currentPage}&client_id=${apiKey}`;
        fetchImages(url, true);
      }
    }

    function updatePagination(current, total) {
      pageInfoEl.textContent = current;
      prevBtnEl.disabled = current <= 1;
      nextBtnEl.disabled = current >= total;
    }

    function toggleTheme() {
      document.body.classList.toggle('dark-mode');
      document.querySelector('.navbar-premium').classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggleEl.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function showLoading(show) {
      loadingSpinnerEl.style.display = show ? 'flex' : 'none';
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalContainerEl.style.display === 'flex') {
        closeModal();
      }
    });

    // Cerrar modal al hacer clic fuera del contenido
    modalBackdropEl.addEventListener('click', closeModal);
