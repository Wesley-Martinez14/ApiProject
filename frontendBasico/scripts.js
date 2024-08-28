document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://127.0.0.1:8080/api';

    // Función para realizar el login
    function login(e) {
        if (e) e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://127.0.0.1:8080/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                alert('Bienvenidos! Se ha iniciado sesión.');
                window.localStorage.setItem('token', data.token);
                window.location.href = '/consulta.html';
            } else {
                alert('Error al iniciar sesión');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ha ocurrido un error durante el login');
        });
    }
    function logout() {
        // Elimina el token del almacenamiento local
        window.localStorage.removeItem('token');
        // Redirige al usuario a la página de inicio de sesión
        window.location.href = '/index.html';
    }
    // Solo ejecuta si los elementos existen en la página actual
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    if (usernameField && passwordField) {
        usernameField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login(e);
            }
        });

        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login(e);
            }
        });
    }

    // Función para verificar la autenticación
    function verificarAutenticacion() {
        const token = window.localStorage.getItem('token');
        if (!token) {
            alert('No se encontró el token. Inicia sesión nuevamente.');
            window.location.href = '/index.html';
            return false;
        }
        return true;
    }

    // Función para cargar los datos de la API
    function cargarDatos() {
        if (!verificarAutenticacion()) return;

        const token = window.localStorage.getItem('token');
        const authHeader = `Token ${token}`;

        // Cargar Categorías
        fetch(`${apiBaseUrl}/categoria/`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const categoriaList = document.getElementById('categoria-list');
            if (categoriaList) {
                data.forEach(categoria => {
                    const li = document.createElement('li');
                    li.textContent = categoria.nombre;
                    categoriaList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error al cargar categorías:', error));

        // Cargar Productos
        fetch(`${apiBaseUrl}/producto/`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const productoList = document.getElementById('producto-list');
            if (productoList) {
                data.forEach(producto => {
                    const li = document.createElement('li');
                    li.textContent = `${producto.nombre} - ${producto.precio}`;
                    productoList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error al cargar productos:', error));

        // Cargar Suplidores
        fetch(`${apiBaseUrl}/suplidor/`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const suplidorList = document.getElementById('suplidor-list');
            if (suplidorList) {
                data.forEach(suplidor => {
                    const li = document.createElement('li');
                    li.textContent = suplidor.nombre;
                    suplidorList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error al cargar suplidores:', error));

        // Cargar Clientes
        fetch(`${apiBaseUrl}/cliente/`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const clienteList = document.getElementById('cliente-list');
            if (clienteList) {
                data.forEach(cliente => {
                    const li = document.createElement('li');
                    li.textContent = `${cliente.nombre} ${cliente.apellido}`;
                    clienteList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error al cargar clientes:', error));

        // Cargar Ventas
        fetch(`${apiBaseUrl}/venta/`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const ventaList = document.getElementById('venta-list');
            if (ventaList) {
                data.forEach(venta => {
                    const li = document.createElement('li');
                    li.textContent = `Cliente: ${venta.cliente.nombre} - Monto: ${venta.monto_total}`;
                    ventaList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error al cargar ventas:', error));

        // Cargar Ajustes de Inventario
        fetch(`${apiBaseUrl}/inventario/`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const inventarioList = document.getElementById('inventario-list');
            if (inventarioList) {
                data.forEach(ajuste => {
                    const li = document.createElement('li');
                    li.textContent = `${ajuste.tipo_proceso} - Producto: ${ajuste.producto.nombre} - Cantidad: ${ajuste.cantidad}`;
                    inventarioList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error al cargar ajustes de inventario:', error));
    }

    // Ejecuta cargarDatos si estamos en la página de consulta
    if (window.location.pathname === '/consulta.html') {
        cargarDatos();
    }
});
