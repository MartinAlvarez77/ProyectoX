from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Intentamos configurar el GPIO 17 para la Raspberry Pi
try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17, GPIO.OUT)
    GPIO.output(17, GPIO.LOW)  # Apagado por defecto al iniciar
    GPIO_DISPONIBLE = True
except (ImportError, RuntimeError):
    # Esto evita que la app se caiga si estás probando el código en una PC (Windows/Mac)
    GPIO_DISPONIBLE = False
    print("Aviso: RPi.GPIO no disponible. Ejecutándose en modo simulación.")

# Ruta principal (Login)
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para la página de Cámaras
@app.route('/camaras')
def camaras():
    return render_template('camaras.html')

# Ruta para la página de Luces LED
@app.route('/leds')
def leds():
    return render_template('leds.html')

# Ruta para la página de Alarmas y Sensores
@app.route('/alarmas')
def alarmas():
    return render_template('alarmas.html')

# Ruta para la página de Configuración
@app.route('/configuracion')
def configuracion():
    return render_template('configuracion.html')

# 🚨 NUEVA RUTA: Endpoint para controlar el GPIO 17 de la alarma desde el frontend
@app.route('/api/alarma', methods=['POST'])
def controlar_alarma():
    data = request.get_json()
    activar = data.get('activar', False)
    
    if GPIO_DISPONIBLE:
        # HIGH (1) para activar la alarma / LOW (0) para apagar
        GPIO.output(17, GPIO.HIGH if activar else GPIO.LOW)
    
    return jsonify({
        'success': True, 
        'estado_gpio_17': activar,
        'modo_simulacion': not GPIO_DISPONIBLE
    })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)