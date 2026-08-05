## Descripción

**Bitácora** es un gestor de tareas sencillo que permite al usuario administrar sus actividades desde una interfaz web.

La aplicación cuenta con un sistema básico de inicio de sesión y permite crear, consultar, editar, completar y eliminar tareas. Las tareas se almacenan utilizando `localStorage` del navegador.

El proyecto también está preparado para ser utilizado como base para la realización de pruebas automatizadas con Selenium.

## Funcionalidades

### Inicio de sesión

* Validación de usuario y contraseña.
* Control básico de sesión mediante `localStorage`.
* Protección de la pantalla principal cuando el usuario no ha iniciado sesión.
* Opción para cerrar sesión.

### Gestión de tareas

* Crear nuevas tareas.
* Agregar una descripción opcional.
* Editar tareas existentes.
* Marcar tareas como completadas.
* Eliminar tareas.
* Mostrar la fecha y hora de creación.

### Búsqueda y filtros

* Buscar tareas por título o descripción.
* Mostrar todas las tareas.
* Filtrar tareas pendientes.
* Filtrar tareas completadas.
* Mostrar la cantidad de resultados encontrados.

### Progreso

* Cantidad total de tareas.
* Cantidad de tareas completadas.
* Porcentaje de progreso.
* Barra visual de progreso.

## Tecnologías utilizadas

* **HTML5** – estructura de la aplicación.
* **CSS3** – diseño y estilos de la interfaz.
* **JavaScript** – lógica y funcionalidad de la aplicación.
* **LocalStorage** – almacenamiento de las tareas y sesión.
* **Selenium** – automatización y pruebas de la aplicación web.
* **Git y GitHub** – control de versiones y almacenamiento del proyecto.

## 📁 Estructura del proyecto

bitacora-selenium/
│
├── TaskManager/
│   ├── auth.js
│   ├── index.html
│   ├── login.html
│   ├── script.js
│   └── style.css
│
├── bitacora-selenium/
│   │
│   ├── helpers/
│   │   ├── driver.js
│   │   ├── layout.js
│   │   ├── login.js
│   │   ├── pause.js
│   │   └── screenshot.js
│   │
│   ├── reports/
│   │   ├── assets/
│   │   ├── screenshots/
│   │   └── reporte.html
│   │
│   ├── tests/
│   │   ├── create task.test.js
│   │   ├── delete task.test.js
│   │   ├── edit task.test.js
│   │   ├── login.test.js
│   │   └── search filter.test.js
│   │
│   ├── config.js
│   ├── package-lock.json
│   └── package.json
│
└── .gitignore
