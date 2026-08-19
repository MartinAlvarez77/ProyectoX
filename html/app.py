from flask import Flask, render_template, Response, jsonify
import cv2

app = Flask(__name__)

# Estado global de la alarma
alarm_state = {"triggered": False}

def gen_frames():
    cap = cv2.VideoCapture(0)  # Conexión a la webcam de la Raspberry Pi
    prev_frame = None
    
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        # Procesamiento para detección de movimiento
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        
        if prev_frame is None:
            prev_frame = gray
            continue
            
        delta = cv2.absdiff(prev_frame, gray)
        thresh = cv2.threshold(delta, 25, 255, cv2.THRESH_BINARY)[1]
        
        # Umbral de sensibilidad para el movimiento
        if thresh.sum() > 1000000:
            alarm_state["triggered"] = True
            
        prev_frame = gray
        
        # Codificar el frame para transmitirlo por streaming web
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def login():
    return render_template('index.html')

@app.route('/camaras.html')
def camaras():
    return render_template('camaras.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/alarm_status')
def alarm_status():
    return jsonify(alarm_state)

@app.route('/reset_alarm', methods=['POST'])
def reset_alarm():
    alarm_state["triggered"] = False
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)