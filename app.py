import cv2
from flask import Flask, render_template, jsonify, request, Response

app = Flask(__name__)

# Configuración de pines de la Raspberry Pi (GPIO 17 para Alarma y GPIO 5 para LED Living)
GPIO_DISPONIBLE = False

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    
    # Configurar GPIO 17 (Alarma)
    GPIO.setup(17, GPIO.OUT)
    GPIO.output(17, GPIO.LOW)
    
    # Configurar GPIO 5 (LED Living)
    GPIO.setup(5, GPIO.OUT)
    GPIO.output(5, GPIO.LOW)
    
    GPIO_DISPONIBLE = True
    print("Librería RPi.GPIO inicializada correctamente.")
except ImportError:
    print("Aviso: RPi.GPIO no está instalada. Ejecutándose en modo simulación (PC).")
except Exception as e:
    print(f"Aviso: No se pudieron configurar los pines GPIO ({e}). Ejecutándose en modo simulación.")

# Inicializar la cámara USB (índice 0 por defecto)
camera = cv2.VideoCapture(0)
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

def generar_frames():
    """Generador continuo de fotogramas desde la cámara USB"""
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# Ruta principal (Login)
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para la página de Cámaras
@app.route('/camaras')
def camaras():
    return render_template('camaras.html')

# Endpoint que consume el navegador para mostrar el streaming de la cámara USB
@app.route('/video_feed_1')
def video_feed_1():
    return Response(generar_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

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

# Endpoint para controlar el GPIO 17 de la alarma desde el frontend
@app.route('/api/alarma', methods=['POST'])
def controlar_alarma():
    data = request.get_json() or {}
    activar = data.get('activar', False)
    
    if GPIO_DISPONIBLE:
        try:
            GPIO.output(17, GPIO.HIGH if activar else GPIO.LOW)
        except Exception as e:
            print(f"Error al cambiar GPIO 17: {e}")
    
    return jsonify({
        'success': True, 
        'estado_gpio_17': activar,
        'modo_simulacion': not GPIO_DISPONIBLE
    })

# Endpoint para controlar el GPIO 05 del LED del Living
@app.route('/api/led/pin5', methods=['POST'])
def controlar_led_pin5():
    data = request.get_json() or {}
    activar = data.get('activar', False)
    
    if GPIO_DISPONIBLE:
        try:
            GPIO.output(5, GPIO.HIGH if activar else GPIO.LOW)
        except Exception as e:
            print(f"Error al cambiar GPIO 05: {e}")
    
    return jsonify({
        'success': True, 
        'estado_gpio_5': activar,
        'modo_simulacion': not GPIO_DISPONIBLE
    })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)