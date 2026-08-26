if (sessionStorage.getItem('powerHomeAuth') !== 'true') {
    window.location.replace('/');
}

function cerrarSesion() {
    sessionStorage.removeItem('powerHomeAuth');
    window.location.replace('/');
}

document.addEventListener('DOMContentLoaded', () => {
    // Función auxiliar para inicializar cada cámara USB
    function iniciarWebcam(videoId) {
        const videoElement = document.getElementById(videoId);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    videoElement.srcObject = stream;
                })
                .catch((error) => {
                    console.error(`No se pudo acceder a la webcam para ${videoId}: `, error);
                    videoElement.style.display = 'none';
                });
        }
    }

    // Inicializar las 4 cámaras de forma independiente
    iniciarWebcam('webcamFeed1');
    iniciarWebcam('webcamFeed2');
    iniciarWebcam('webcamFeed3');
    iniciarWebcam('webcamFeed4');

    const recordingState = localStorage.getItem('recording');
    const camerasGrid = document.getElementById('camerasGrid');
    const statusBadge = document.getElementById('cam-status-badge');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const subtitle = document.getElementById('system-subtitle');

    const isRecordingActive = recordingState === null ? true : (recordingState === 'true');

    if (!isRecordingActive) {
        if (camerasGrid) camerasGrid.style.display = 'none';
        
        const warningBox = document.createElement('div');
        warningBox.className = 'system-offline-message';
        warningBox.innerHTML = `
            <i class="fa-solid fa-video-slash offline-icon"></i>
            <h2>Cámaras Desactivadas</h2>
            <p>El sistema de vigilancia se encuentra apagado desde el panel de configuración.</p>
            <a href="/configuracion" class="btn-config-redirect">Ir a Configuración</a>
        `;
        
        const container = document.getElementById('content-container');
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
    }
});