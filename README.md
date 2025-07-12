# Infinity Gallery - README



## 📌 Descripción del Proyecto

Infinity Gallery es una galería de imágenes moderna que utiliza la API de Unsplash para mostrar fotografías de alta calidad. La aplicación permite:

- 🔍 Buscar imágenes por palabras clave
- 🌟 Guardar imágenes favoritas localmente
- 🌗 Cambiar entre modo claro y oscuro
- 📱 Diseño completamente responsive
- 🔎 Vista modal con zoom y detalles EXIF
- 📥 Descarga de imágenes

## 🚀 Características Principales

- **Interfaz Premium**: Diseño elegante con efectos de gradiente y transiciones suaves
- **Modo Oscuro**: Alterna entre temas claro y oscuro con persistencia local
- **Favoritos**: Guarda tus imágenes favoritas en el localStorage
- **Responsive**: Adaptable a todos los dispositivos
- **Performance**: Carga diferida de imágenes para mejor rendimiento
- **API de Unsplash**: Acceso a millones de imágenes de alta calidad

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3 (con variables CSS)
  - JavaScript ES6+
  - Bootstrap 5 (para componentes y grid)
  - Font Awesome (iconos)
  - Animate.css (animaciones)
  
- **Hosting**:
  - Firebase Hosting

- **API**:
  - Unsplash API (para obtener imágenes)

```

## 🔧 Configuración

1. **Clave API de Unsplash**:
   - Obtén una API key gratuita de [Unsplash Developers](https://unsplash.com/developers)
   - Reemplaza `` en `app.js` con tu propia clave

2. **Configuración de Firebase**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🎨 Personalización

Puedes modificar los colores principales editando las variables CSS en `:root`:

```css
:root {
  --primary-color: #1CB5E0;
  --secondary-color: #000851;
  --dark-bg: #121212;
  --light-text: #f5f5f5;
  --card-bg: #ffffff;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  --modal-bg: #ffffff;
  --modal-dark-bg: #2d2d2d;
}
```

## 🌐 Despliegue en Firebase

1. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Inicia sesión y configura el proyecto:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Selecciona tu proyecto Firebase o crea uno nuevo

4. Despliega la aplicación:
   ```bash
   firebase deploy
   ```

## 📱 Responsive Design

La aplicación está diseñada para funcionar en:

- Pantallas grandes (≥1200px)
- Tablets (≥768px)
- Móviles (≥576px)

## 📝 Licencia

Este proyecto utiliza imágenes de [Unsplash](https://unsplash.com) que están sujetas a su propia [licencia](https://unsplash.com/license). El código es de uso libre bajo licencia MIT.

## ✨ Créditos

- [Unsplash](https://unsplash.com) por la API de imágenes
- [Bootstrap](https://getbootstrap.com) por el framework CSS
- [Font Awesome](https://fontawesome.com) por los iconos
- [Animate.css](https://animate.style) por las animaciones

---

**🎉 ¡Disfruta explorando Infinity Gallery!** 🎉
