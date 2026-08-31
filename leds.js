if (sessionStorage.getItem('powerHomeAuth') !== 'true') {
    window.location.href = '/';
}

function cerrarSesion() {
    sessionStorage.removeItem('powerHomeAuth');
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
    const ledLivingState = localStorage.getItem('ledLiving');

    const cardLiving = document.getElementById('cardLiving');
    const livingStatusText = document.getElementById('livingStatusText');
    const pinStateTitle = document.getElementById('pinStateTitle');
    const ledIconVisual = document.getElementById('ledIconVisual');
    
    const btnTogglePin5 = document.getElementById('btnTogglePin5');
    const btnText = document.getElementById('btnText');
    
    const statusBadge = document.getElementById('led-status-badge');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const subtitle = document.getElementById('led-subtitle');

    const isLivingActive = ledLivingState === null ? false : (ledLivingState === 'true');

    function actualizarInterfazPin5(activar) {
        if (!activar) {
            cardLiving.style.opacity = '0.5';
            livingStatusText.textContent = 'APAGADO';
            livingStatusText.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            livingStatusText.style.color = '#ef4444';
            
            if (pinStateTitle) pinStateTitle.textContent = 'LED Desactivada';
            if (ledIconVisual) {
                ledIconVisual.style.color = '#484f58';
                ledIconVisual.style.filter = 'drop-shadow(0 0 0 rgba(0,0,0,0))';
            }
            if (btnTogglePin5) {
                btnTogglePin5.style.backgroundColor = '#21262d';
                btnTogglePin5.style.color = '#c9d1d9';
                btnTogglePin5.style.borderColor = '#30363d';
            }
            if (btnText) btnText.textContent = 'ENCENDER LED';
        } else {
            cardLiving.style.opacity = '1';
            livingStatusText.textContent = 'ENCENDIDO';
            livingStatusText.style.backgroundColor = 'rgba(35, 134, 54, 0.15)';
            livingStatusText.style.color = '#238636';
            
            if (pinStateTitle) pinStateTitle.textContent = 'LED Activada';
            if (ledIconVisual) {
                ledIconVisual.style.color = '#f59e0b';
                ledIconVisual.style.filter = 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))';
            }
            if (btnTogglePin5) {
                btnTogglePin5.style.backgroundColor = '#238636';
                btnTogglePin5.style.color = '#ffffff';
                btnTogglePin5.style.borderColor = '#2ea043';
            }
            if (btnText) btnText.textContent = 'APAGAR LED';
        }
    }

    actualizarInterfazPin5(isLivingActive);

    if (btnTogglePin5) {
        btnTogglePin5.addEventListener('click', () => {
            const estadoActual = localStorage.getItem('ledLiving') === 'true';
            const nuevoEstado = !estadoActual;

            fetch('/api/led/pin5', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ activar: nuevoEstado })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta GPIO 05:', data);
                localStorage.setItem('ledLiving', nuevoEstado);
                actualizarInterfazPin5(nuevoEstado);
            })
            .catch(error => {
                console.error('Error al conectar con el servidor:', error);
            });
        });
    }

    if (!isLivingActive) {
        if (statusBadge) statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        if (statusBadge) statusBadge.style.color = '#ef4444';
        if (statusDot) statusDot.style.backgroundColor = '#ef4444';
        if (statusDot) statusDot.style.boxShadow = '0 0 8px #ef4444';
        if (statusText) statusText.textContent = 'Sistema en Reposo';
        if (subtitle) subtitle.textContent = 'Hardware GPIO 05 inactivo';
    }
});