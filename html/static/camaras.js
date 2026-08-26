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
        // Si está activo, procedemos a encender las cámaras
        const videoIds = ['webcamFeed1', 'webcamFeed2', 'webcamFeed3', 'webcamFeed4'];

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Solicitamos la cámara 1 vez para evitar conflictos de puertos/hardware en el navegador
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    videoIds.forEach((videoId) => {
                        const videoElement = document.getElementById(videoId);
                        if (videoElement) {
                            // Clonamos el stream para que cada etiqueta <video> reproduzca la señal de forma independiente
                            videoElement.srcObject = stream.clone();
                        }
                    });
                })
                .catch((error) => {
                    console.error("No se pudo acceder a la webcam (asegúrate de usar HTTPS o localhost):", error);
                    // Si falla, ocultamos los videos o mostramos el error en ellos
                    videoIds.forEach((videoId) => {
                        const videoElement = document.getElementById(videoId);
                        if (videoElement) videoElement.style.display = 'none';
                    });
                });
        } else {
            console.error("Tu navegador no soporta el acceso a la cámara (getUserMedia).");
        }
    }
});