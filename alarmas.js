if (sessionStorage.getItem('powerHomeAuth') !== 'true') {
    window.location.replace('/');
}

function cerrarSesion() {
    sessionStorage.removeItem('powerHomeAuth');
    window.location.replace('/');
}

// Envío de estado al GPIO 17 de la Raspberry Pi (Flask API)
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
        console.log('GPIO 17 actualizado:', data.estado_gpio_17 ? 'ACTIVADO (HIGH)' : 'DESACTIVADO (LOW)');
    })
    .catch(error => {
        console.error('Error al conectar con GPIO 17:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el estado de la alarma (por defecto 'true' o guardado como 'false' desde configuración)
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
        // Estado: Desactivado
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

        // 🔴 APAGAR EL GPIO 17 si la alarma está desactivada en configuración
        enviarSenalGPIO(false);
    } else {
        // Estado: Activado / Armado
        if (mainShieldIcon) mainShieldIcon.style.color = '#238636';
        if (mainAlarmTitle) mainAlarmTitle.textContent = 'Estado del Perímetro: Armado';
        if (mainAlarmDesc) mainAlarmDesc.textContent = 'Los sensores de movimiento se encuentran vigilando la propiedad.';

        if (statusBadge) {
            statusBadge.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            statusBadge.style.color = '#3b82f6';
        }
        if (statusDot) {
            statusDot.style.backgroundColor = '#3b82f6';
            statusDot.style.boxShadow = '0 0 8px #3b82f6';
        }
        if (statusText) statusText.textContent = 'Sistema Armado';
        if (subtitle) subtitle.textContent = 'Control de perímetro y alertas de movimiento';

        document.querySelectorAll('.sensor-card').forEach(card => {
            card.style.opacity = '1';
        });

        // 🟢 MANTENER APAGADO EL GPIO 17 hasta que ocurra un evento/disparo real
        // (Si deseas que al armar el sistema el pin se ponga en HIGH permanente, cambia esto a `enviarSenalGPIO(true)`)
        enviarSenalGPIO(false);
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

    // 🚨 Únicamente activamos la señal en el GPIO 17 (HIGH) cuando simula o ocurre un disparo de movimiento
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
        // 🔕 Volvemos a apagar el GPIO 17 (LOW) una vez finalizada la alerta visual
        enviarSenalGPIO(false);
    }, 5000);
}