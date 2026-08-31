// Verificar autenticación al cargar el script
if (sessionStorage.getItem('powerHomeAuth') !== 'true') {
    window.location.replace('/');
}

// Función global para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('powerHomeAuth');
    window.location.replace('/');
}

document.addEventListener('DOMContentLoaded', () => {
    const camerasGrid = document.getElementById('camerasGrid');
    const statusBadge = document.getElementById('cam-status-badge');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const subtitle = document.getElementById('system-subtitle');
    const container = document.getElementById('content-container');

    const recordingState = localStorage.getItem('recording');
    const isRecordingActive = recordingState === null ? true : (recordingState === 'true');

    if (!isRecordingActive) {
        // Si el sistema está desactivado, ocultamos las cámaras y mostramos el mensaje offline
        if (camerasGrid) camerasGrid.style.display = 'none';
        
        const warningBox = document.createElement('div');
        warningBox.className = 'system-offline-message';
        warningBox.innerHTML = `
            <i class="fa-solid fa-video-slash offline-icon"></i>
            <h2>Cámaras Desactivadas</h2>
            <p>El sistema de vigilancia se encuentra apagado desde el panel de configuración.</p>
            <a href="/configuracion" class="btn-config-redirect">Ir a Configuración</a>
        `;
        
        if (container) container.appendChild(warningBox);

        if (statusBadge) {
            statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            statusBadge.style.color = '#ef4444';
        }
        if (statusDot) {
            statusDot.style.backgroundColor = '#ef4444';
            statusDot.style.boxShadow = '0 0 8px #ef4444';
        }
        if (statusText) statusText.textContent = 'Desactivado';
        if (subtitle) subtitle.textContent = 'Sistema de vigilancia fuera de línea';

    } else {
        // Si está activo, el streaming de OpenCV se carga automáticamente mediante las etiquetas <img> en el HTML.
        // Aquí puedes agregar lógica adicional en tiempo real si lo deseas.
        console.log("Sistema de cámaras en línea. Recibiendo streaming desde Raspberry Pi.");
    }
});