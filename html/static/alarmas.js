function cerrarSesion() {
    sessionStorage.removeItem('powerHomeAuth');
    window.location.replace('/');
}

// Función auxiliar para enviar el estado al GPIO 17 de la Raspberry Pi mediante Flask
function enviarSenalGPIO(activar) {
    fetch('/api/alarma', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activar: activar })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Señal GPIO 17 actualizada:', data.estado_gpio_17 ? 'ACTIVADO (HIGH)' : 'APAGADO (LOW)');
    })
    .catch(error => {
        console.error('Error al comunicarse con el GPIO de la Raspberry Pi:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const alarmState = localStorage.getItem('alarm');
    const isAlarmActive = alarmState === null ? true : (alarmState === 'true');

    const statusBadge = document.getElementById('alarm-status-badge');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('alarm-status-text');
    const subtitle = document.getElementById('alarm-subtitle');
    const mainShieldIcon = document.getElementById('mainShieldIcon');
    const mainAlarmTitle = document.getElementById('mainAlarmTitle');
    const mainAlarmDesc = document.getElementById('mainAlarmDesc');

    if (!isAlarmActive) {
        if (mainShieldIcon) mainShieldIcon.style.color = '#ef4444';
        if (mainAlarmTitle) mainAlarmTitle.textContent = 'Estado del Perímetro: Desactivado';
        if (mainAlarmDesc) mainAlarmDesc.textContent = 'El sistema de alarma general se encuentra apagado desde Configuración.';
        
        if (statusBadge) {
            statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            statusBadge.style.color = '#ef4444';
        }
        if (statusDot) {
            statusDot.style.backgroundColor = '#ef4444';
            statusDot.style.boxShadow = '0 0 8px #ef4444';
        }
        if (statusText) statusText.textContent = 'Desactivado';
        if (subtitle) subtitle.textContent = 'Sistema de seguridad fuera de línea';

        document.querySelectorAll('.sensor-card').forEach(card => {
            card.style.opacity = '0.4';
        });

        // 🔴 Apagar el GPIO 17 si el sistema está desactivado
        enviarSenalGPIO(false);
    } else {
        // 🟢 Asegurar que el GPIO 17 esté listo/activo si el sistema está armado
        enviarSenalGPIO(true);
    }
});

function simularMovimiento() {
    const alarmState = localStorage.getItem('alarm');
    const isAlarmActive = alarmState === null ? true : (alarmState === 'true');

    if (!isAlarmActive) {
        alert('No se pueden detectar movimientos porque la alarma está desactivada en Configuración.');
        return;
    }

    const sensores = [
        { id: 'sensorFront', nombre: 'Entrada Principal' },
        { id: 'sensorBack', nombre: 'Patio Trasero' },
        { id: 'sensorLiving', nombre: 'Living / Estar' },
        { id: 'sensorGarage', nombre: 'Cochera' }
    ];

    const sensorAleatorio = sensores[Math.floor(Math.random() * sensores.length)];
    const banner = document.getElementById('motionAlertBanner');
    const desc = document.getElementById('alertDescription');
    const tarjeta = document.getElementById(sensorAleatorio.id);

    desc.textContent = `Se ha detectado actividad inusual en: ${sensorAleatorio.nombre}`;
    banner.style.display = 'flex';

    // 🚨 Al haber movimiento detectado, activamos con fuerza la señal en el GPIO 17
    enviarSenalGPIO(true);

    if (tarjeta) {
        tarjeta.style.borderColor = '#ef4444';
        tarjeta.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
        const badge = tarjeta.querySelector('.sensor-state');
        if (badge) {
            badge.textContent = '¡Movimiento!';
            badge.className = 'sensor-state alert';
        }
    }

    setTimeout(() => {
        banner.style.display = 'none';
        if (tarjeta) {
            tarjeta.style.borderColor = '#30363d';
            tarjeta.style.backgroundColor = '#161b22';
            const badge = tarjeta.querySelector('.sensor-state');
            if (badge) {
                badge.textContent = 'Normal';
                badge.className = 'sensor-state normal';
            }
        }
    }, 5000);
}