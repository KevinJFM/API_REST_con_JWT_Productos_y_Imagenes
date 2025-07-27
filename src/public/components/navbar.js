// Función para insertar el navbar en la página
function insertNavbar() {

    // Crear el elemento del navbar
    const navbar = document.createElement('div');
    navbar.className = 'navbar';
    navbar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #4a90e2;
        color: white;
        padding: 10px 20px;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Crear el logo/título
    const logo = document.createElement('div');
    logo.className = 'navbar-logo';
    logo.innerHTML = '<a href="/profile" style="color: white; text-decoration: none;"><span style="font-size: 24px; font-weight: bold;">Sistema de Tienda</span></a>';

    // Crear el contenedor de navegación
    const navLinks = document.createElement('div');
    navLinks.className = 'navbar-links';
    navLinks.style.cssText = `
        display: flex;
        gap: 20px;
        align-items: center;
    `;

    // Obtener el rol del usuario desde localStorage (si está disponible)
    let userRole = null;
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // Decodificar el token JWT (parte simple sin verificación)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            userRole = payload.role_id;
        }
    } catch (error) {
        // console.error('Error decoding token:', error);
    }

    // Función para crear un enlace de navegación
    function createNavLink(text, href) {
        const link = document.createElement('a');
        link.textContent = text;
        link.href = href;

        // Verificar si el enlace actual corresponde a la página actual
        const currentPath = window.location.pathname;
        const isCurrentPage = currentPath === href ||
            (href !== '/profile' && currentPath.includes(href));

        link.style.cssText = `
            color: white;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 4px;
            transition: background-color 0.3s;
            ${isCurrentPage ? 'background-color: rgba(255,255,255,0.2);' : ''}
            font-weight: ${isCurrentPage ? 'bold' : 'normal'};
        `;

        link.onmouseover = function () {
            if (!isCurrentPage) this.style.backgroundColor = 'rgba(255,255,255,0.2)';
        };
        link.onmouseout = function () {
            if (!isCurrentPage) this.style.backgroundColor = 'transparent';
        };

        return link;
    }

    // Agregar enlaces según el rol del usuario
    navLinks.appendChild(createNavLink('Perfil', '/profile'));

    // Acceso para todos los usuarios autenticados
    navLinks.appendChild(createNavLink('Productos', '/product'));

    // Acceso solo para administradores
    if (userRole === 1) {
        navLinks.appendChild(createNavLink('Admin', '/admin'));
    }

    // Agregar separador visual antes del botón de logout
    const separator = document.createElement('div');
    separator.style.cssText = `
        height: 24px;
        width: 1px;
        background-color: rgba(255,255,255,0.3);
        margin: 0 5px;
    `;
    navLinks.appendChild(separator);

    // Agregar botón de logout con icono
    const logoutBtn = document.createElement('a');

    // Solo icono SVG Boton de salida
    logoutBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 18px; height: 18px; fill: currentColor;">
            <path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z"/>
        </svg>
    `;
    logoutBtn.title = 'Logout'; // Tooltip para accesibilidad
    logoutBtn.href = '#';
    logoutBtn.style.cssText = `
        color: white;
        text-decoration: none;
        padding: 10px;
        border-radius: 6px;
        background-color: rgba(255,255,255,0.2);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        width: 40px;
        height: 40px;
    `;
    logoutBtn.onmouseover = function () {
        this.style.backgroundColor = 'rgba(255,255,255,0.3)';
        this.style.transform = 'translateY(-1px)';
    };
    logoutBtn.onmouseout = function () {
        this.style.backgroundColor = 'rgba(255,255,255,0.2)';
        this.style.transform = 'translateY(0)';
    };
    logoutBtn.onclick = function (e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };
    navLinks.appendChild(logoutBtn);

    // Agregar elementos al navbar
    navbar.appendChild(logo);
    navbar.appendChild(navLinks);

    // Insertar el navbar al principio del body
    document.body.insertBefore(navbar, document.body.firstChild);

    // Agregar un poco de espacio después del navbar
    const spacer = document.createElement('div');
    spacer.style.height = '20px';
    document.body.insertBefore(spacer, navbar.nextSibling);

    // Agregar estilos responsivos para móviles
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function handleMobileLayout(e) {
        if (e.matches) {
            // Móvil
            navbar.style.flexDirection = 'column';
            navbar.style.padding = '10px';
            navLinks.style.marginTop = '10px';
            navLinks.style.width = '100%';
            navLinks.style.justifyContent = 'center';
            navLinks.style.flexWrap = 'wrap';
        } else {
            // Desktop
            navbar.style.flexDirection = 'row';
            navbar.style.padding = '10px 20px';
            navLinks.style.marginTop = '0';
            navLinks.style.width = 'auto';
        }
    }

    // Aplicar inicialmente
    handleMobileLayout(mediaQuery);
    // Escuchar cambios usando addEventListener en lugar de addListener (que está obsoleto)
    mediaQuery.addEventListener('change', handleMobileLayout);
}

// Exportar la función para que pueda ser usada en otras páginas
if (typeof module !== 'undefined') {
    module.exports = { insertNavbar };
}