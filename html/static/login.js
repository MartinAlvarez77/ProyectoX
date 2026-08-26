document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');

    if (user === 'eze' && pass === 'ProyectoX') {
        // Genera la sesión de acceso autorizado
        sessionStorage.setItem('powerHomeAuth', 'true');
        // Redirige a la ruta protegida de Flask
        window.location.href = '/alarmas'; 
    } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos.';
        errorDiv.style.display = 'block';
    }
});