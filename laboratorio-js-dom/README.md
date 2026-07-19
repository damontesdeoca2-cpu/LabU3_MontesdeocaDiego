# Laboratorio: Manipulación de Elementos Web (DOM)

Sistema de registro de estudiantes construido con JavaScript vanilla, que demuestra la manipulación del DOM, manejo de eventos, arreglos de objetos, modales Bootstrap, búsqueda/filtrado y animaciones con la librería anime.js.

## Tecnologías utilizadas

- **HTML5** - Estructura semántica del formulario y tabla
- **Bootstrap 5.3.3** - Framework CSS con tema oscuro (`data-bs-theme="dark"`) para diseño responsivo y componentes (modal, inputs, botones, badges)
- **JavaScript Vanilla (ES6+)** - Manipulación del DOM con `getElementById`, `createElement`, `appendChild`, `textContent`, `innerHTML`, `classList`, `addEventListener`
- **SweetAlert2 v11** - Confirmaciones visuales para eliminar registros y limpiar la tabla
- **Toastify JS** - Notificaciones emergentes (toasts) con colores personalizados para cada tipo de acción
- **Anime.js v4** - Motor de animaciones para transiciones de entrada de la tarjeta, filas de la tabla, animación del contador, efectos de sacudida en validación y animación del contenido JSON en el modal
- **Font Awesome 6.5** - Iconos vectoriales en botones, labels y estados vacíos

## Funcionalidades implementadas

### 1. Registro de estudiantes
- Formulario con 3 campos: nombre (texto), carrera (select), semestre (número)
- Validación de campos vacíos antes de agregar
- Cada estudiante se guarda como objeto `{ nombre, carrera, semestre }` en un arreglo global

### 2. Tabla dinámica
- Se renderiza completamente desde el arreglo `estudiantesRegistrados`
- Columna de acciones con botones: Ver JSON, Editar, Eliminar (usando iconos Font Awesome)
- Indicador visual de carrera con badge personalizado
- Estado vacío con icono cuando no hay registros
- Animación de entrada escalonada (stagger) de las filas con anime.js

### 3. Modo edición
- Al presionar "Editar", los datos se cargan en el formulario
- El botón principal cambia de "Agregar estudiante" (azul) a "Guardar cambios" (amarillo)
- Al guardar, se actualiza el objeto en el arreglo y la tabla se re-renderiza
- Se conserva el índice de edición para saber si es alta o modificación

### 4. Eliminación con confirmación
- SweetAlert2 muestra un diálogo de confirmación antes de borrar
- Si el estudiante eliminado estaba en modo edición, se cancela la edición
- Se ajusta el `editandoIndex` si se elimina un registro anterior al que se edita

### 5. JSON individual y general
- Cada fila tiene un botón "Ver JSON" que muestra el objeto del estudiante en un modal
- El botón "JSON" superior muestra todos los estudiantes registrados
- Si no hay registros, muestra un mensaje informativo
- El modal usa un `<pre>` con estilo de terminal (fondo oscuro, texto cian)

### 6. Búsqueda por texto
- Input con placeholder "Nombre, carrera o semestre..."
- Filtra el arreglo usando `.filter()` con `.includes()` sobre nombre, carrera y semestre
- Botón "Limpiar búsqueda" restaura la tabla completa

### 7. Filtro por carrera
- Select con opción "Todas las carreras" y las 3 carreras disponibles
- Filtra comparando `estudiante.carrera === carreraSeleccionada`
- Si se selecciona "Todas", muestra todos los registros

### 8. Limpiar tabla
- SweetAlert2 confirma antes de limpiar
- Reinicia: arreglo, contador, modo edición, formulario y tabla
- Animación de salida de filas (desplazamiento a la derecha) antes de limpiar

### 9. Contador de estudiantes
- Se actualiza dinámicamente después de cada operación (agregar, editar, eliminar, limpiar)
- Animación numérica del 0 al valor final usando anime.js

### 10. Mensajes visuales
- **Toastify**: Notificaciones flotantes con colores según tipo (verde=éxito, rojo=eliminar, amarillo=advertencia, azul=info)
- **SweetAlert2**: Diálogos de confirmación para acciones destructivas
- Efecto de sacudida (shake) en el botón cuando la validación falla

## Diseño visual

- Tema oscuro moderno con `data-bs-theme="dark"` de Bootstrap 5
- Paleta de colores: fondo #0f1117, tarjeta #1a1d23, acento #00d4ff (cian)
- Tarjeta principal con bordes redondeados (16px) y sombra profunda
- Headers de tabla con texto uppercase y letter-spacing
- Botones de acción con iconos y colores semánticos (cian=JSON, amarillo=editar, rojo=eliminar)
- Favicon SVG con emoji de birrete de graduación
- Fuentes monoespaciadas para el código JSON

## Integración de anime.js (API externa)

Anime.js se utilizó para agregar animaciones fluidas a la interfaz:

- **Entrada de la tarjeta principal**: Fade-in + desplazamiento vertical al cargar la página
- **Filas de la tabla**: Animación de entrada con stagger (escalonamiento) de 60ms entre filas
- **Contador numérico**: Animación del número de 0 al valor actual con easing exponencial
- **Validación fallida**: Efecto de sacudida horizontal del botón "Agregar"
- **Edición**: Parpadeo del borde del input de nombre para indicar modo activo
- **Modal JSON**: Fade-in del contenido `<pre>` al abrir el modal
- **Limpieza de tabla**: Animación de salida de filas (desplazamiento + opacidad) antes de vaciar

El CDN utilizado es: `https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js`

Se desestructura la API global: `const { animate, stagger, createTimeline } = anime;`

## Cómo ejecutar

1. Descargar o clonar el repositorio
2. Abrir el archivo `index.html` directamente en un navegador web moderno
3. No se requiere servidor local ni instalación de dependencias
4. Las librerías externas se cargan vía CDN

## Estructura del proyecto

```
laboratorio-js-dom/
  index.html    - Estructura HTML con Bootstrap 5 dark theme
  app.js        - Toda la lógica JavaScript (DOM, eventos, animaciones)
  README.md     - Esta documentación
```