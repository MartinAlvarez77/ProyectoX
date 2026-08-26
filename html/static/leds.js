if (sessionStorage.getItem('powerHomeAuth') !== 'true') {
    window.location.href = '/';
}

function cerrarSesion() {
    sessionStorage.removeItem('powerHomeAuth');
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
    const ledLivingState = localStorage.getItem('ledLiving');
    const ledOutdoorState = localStorage.getItem('ledOutdoor');
    const brightnessState = localStorage.getItem('brightness');

    const cardLiving = document.getElementById('cardLiving');
    const cardOutdoor = document.getElementById('cardOutdoor');
    const livingStatusText = document.getElementById('livingStatusText');
    const outdoorStatusText = document.getElementById('outdoorStatusText');
    
    const brightnessRange = document.getElementById('brightnessRange');
    const brightnessValue = document.getElementById('brightnessValue');
    
    const statusBadge = document.getElementById('led-status-badge');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const subtitle = document.getElementById('led-subtitle');

    const isLivingActive = ledLivingState === null ? true : (ledLivingState === 'true');
    const isOutdoorActive = ledOutdoorState === null ? false : (ledOutdoorState === 'true');

    if (!isLivingActive) {
        cardLiving.style.opacity = '0.5';
        livingStatusText.textContent = 'APAGADO';
        livingStatusText.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        livingStatusText.style.color = '#ef4444';
    } else {
        livingStatusText.textContent = 'ENCENDIDO';
        livingStatusText.style.backgroundColor = 'rgba(35, 134, 54, 0.15)';
        livingStatusText.style.color = '#238636';
    }

    if (!isOutdoorActive) {
        cardOutdoor.style.opacity = '0.5';
        outdoorStatusText.textContent = 'APAGADO';
        outdoorStatusText.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        outdoorStatusText.style.color = '#ef4444';
    } else {
        outdoorStatusText.textContent = 'ENCENDIDO';
        outdoorStatusText.style.backgroundColor = 'rgba(35, 134, 54, 0.15)';
        outdoorStatusText.style.color = '#238636';
    }

    if (brightnessState !== null && brightnessRange) {
        brightnessRange.value = brightnessState;
        if (brightnessValue) brightnessValue.textContent = brightnessState + '%';
    }

    if (brightnessRange) {
        brightnessRange.addEventListener('input', (e) => {
            const val = e.target.value;
            if (brightnessValue) brightnessValue.textContent = val + '%';
            localStorage.setItem('brightness', val);
        });
    }

    if (!isLivingActive && !isOutdoorActive) {
        statusBadge.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        statusBadge.style.color = '#ef4444';
        statusDot.style.backgroundColor = '#ef4444';
        statusDot.style.boxShadow = '0 0 8px #ef4444';
        statusText.textContent = 'Todo Apagado';
        subtitle.textContent = 'Sistema de iluminación en reposo';
    }
});