ProyectoX: Sistema de Monitoreo y Automatización Domótica

ProyectoX es una plataforma de IoT (Internet de las Cosas) y domótica desarrollada en Python (Flask). El sistema integra el streaming de cámaras de seguridad en tiempo real y gestiona componentes de hardware (luces LED y sensores de alarma) mediante un servidor embebido o una computadora convencional.
📋 Requisitos Previos

    Hardware mínimo:

        PC o servidor local (Windows, macOS o Linux) / Raspberry Pi 3 B+ o superior.

        Cámara web conectada por USB.

        (Opcional) LEDs y relés conectados a los puertos GPIO (en caso de usar Raspberry Pi).

    Software:

        Python 3.8 o superior.

        Navegador web moderno (Chrome, Edge, Firefox, Safari).

🛠️ Instalación de Python

Si aún no tienes Python instalado en tu equipo, sigue los pasos según tu sistema operativo:
1. Windows

    Ve al sitio web oficial: python.org/downloads.

    Descarga el instalador ejecutable de Python 3.

    Paso Crucial: Al ejecutar el instalador, marca obligatoriamente la casilla "Add Python.exe to PATH" en la parte inferior antes de hacer clic en Install Now.

    Abre la consola (cmd) y confirma la instalación:
    DOS

    python --version

2. macOS

    Abre la Terminal y verifica si ya cuentas con Python 3 instalado:
    Bash

    python3 --version

    Si no lo está, puedes descargarlo directamente desde python.org o usando Homebrew:
    Bash

    brew install python

3. Linux (Ubuntu / Debian / Raspberry Pi OS)

Las distribuciones basadas en Debian suelen incluir Python 3 por defecto. Puedes verificar e instalar las herramientas necesarias ejecutando:
Bash

sudo apt update
sudo apt install python3 python3-pip python3-venv -y

📁 Estructura del Proyecto

Para asegurar el correcto enrutamiento del servidor web (Flask), la arquitectura de archivos del proyecto debe organizarse de la siguiente manera:
Plaintext

proyecto_x/
├── app.py                      # Servidor backend Flask y gestión de hardware/cámara
├── templates/                  # Vistas del frontend (Documentos HTML)
│   ├── index.html
│   ├── camaras.html
│   ├── leds.html
│   ├── alarmas.html
│   └── configuracion.html
└── static/                     # Hojas de estilo y archivos JavaScript
    ├── style.css
    ├── camaras.css
    ├── leds.css
    ├── alarmas.css
    ├── configuracion.css
    ├── login.js
    ├── camaras.js
    ├── leds.js
    ├── alarmas.js
    └── configuracion.js

🚀 Instalación y Despliegue Paso a Paso
Paso 1: Clonar o Descargar el Proyecto

Crea la carpeta de tu proyecto y navega hasta ella desde la terminal o consola:
Bash

mkdir proyecto_x
cd proyecto_x

Paso 2: Crear un Entorno Virtual (Recomendado)

Es una buena práctica de software aislar las dependencias del proyecto:
Bash

# Crear entorno virtual
python -m venv venv

# Activar en Windows:
venv\Scripts\activate

# Activar en Linux / macOS:
source venv/bin/activate

Paso 3: Instalación de Dependencias

Instala los paquetes de Python requeridos mediante pip:

    Flask: Microframework para servir la interfaz web y la API REST.
    Bash

    pip install flask

    OpenCV: Biblioteca encargada del procesamiento de imágenes y streaming de la cámara USB.
    Bash

    pip install opencv-python

    RPi.GPIO (Solo para entornos Raspberry Pi):
    Bash

    pip install RPi.GPIO

        Nota de compatibilidad: Si ejecutas el proyecto desde una PC (Windows/Mac/Linux sin GPIO), la aplicación detectará automáticamente la ausencia de los componentes físicos y pasará al Modo Simulación.

🔌 Configuración de Hardware (Cámara)

    Conecta la cámara USB a un puerto libre de tu sistema.

    En app.py, el dispositivo por defecto utiliza el índice 1 (cv2.VideoCapture(1)).

    Si la cámara no emite señal al arrancar la aplicación, abre el archivo app.py y modifica el índice por 0:
    Python

    # Reemplaza el canal si tu cámara primaria es la predeterminada del sistema
    camera = cv2.VideoCapture(0, cv2.CAP_V4L2)

💻 Ejecución del Servidor

Con el entorno virtual activo, arranca la aplicación ejecutando:
Bash

python app.py

Al iniciar correctamente, la consola mostrará un mensaje indicando que el servidor Flask está activo bajo protocolo seguro (SSL) o local:
Plaintext

 * Running on https://127.0.0.1:5000
 * Running on https://<TU-IP-LOCAL>:5000

🌐 Uso del Sistema

    Abre tu navegador e ingresa a https://localhost:5000 o [https://127.0.0.1:5000](https://127.0.0.1:5000).

    Aviso de Certificado de Seguridad: Al usar SSL autofirmado (ssl_context='adhoc'), el navegador puede desplegar una advertencia de seguridad. Haz clic en Opciones Avanzadas y selecciona Continuar a localhost (no seguro).

    Módulo de Autenticación: En la pantalla de inicio de sesión (index.html), ingresa un usuario (ej. eze) y cualquier contraseña para validar el token de sesión (sessionStorage).

    Funcionalidades del Panel:

        Cámaras: Monitoreo en vivo vía streaming.

        Luces LED: Conmutación del PIN GPIO 5.

        Alarmas: Simulación de disparos de sensores e interacción con el PIN GPIO 17.

        Configuración: Control global del estado del perímetro y grabación.
