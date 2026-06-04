import http.server
import socket
import socketserver
import os
import sys

# Configure stdout/stderr to use UTF-8 to support QR code block characters in Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')


# Change working directory to "Mobil App" so the server serves the web application
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.join(script_dir, "Mobil App"))

# Auto-install qrcode library if missing
try:
    import qrcode
except ImportError:
    print("System: 'qrcode' kütüphanesi eksik, otomatik kuruluyor...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "qrcode"])
    import qrcode

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't even have to be reachable, just triggers OS routing table lookup
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

PORT = 8000
IP = get_local_ip()
url = f"http://{IP}:{PORT}"

# Terminal QR banner decoration
print("\n" + "=" * 60)
print("             MOBIL APP YEREL SUNUCUSU BAŞLATILDI")
print("=" * 60)
print(f"Telefon veya tabletinizden uygulamaya erişmek için:")
print(f"1. Mobil cihazınızın ve bu bilgisayarın AYNI Wi-Fi ağına")
print("   bağlı olduğundan emin olun.")
print(f"2. Kameranızı açıp aşağıdaki QR kodu taratın:")
print(f"   URL: {url}")
print("=" * 60 + "\n")

# Generate QR code and display in console
qr = qrcode.QRCode(version=1, box_size=1, border=2)
qr.add_data(url)
qr.make(fit=True)

# print_ascii prints the QR code directly to standard terminal output
qr.print_ascii(invert=True)

def kill_process_on_port(port):
    import subprocess
    import time
    try:
        result = subprocess.run(
            ["netstat", "-ano"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            for line in result.stdout.splitlines():
                if f":{port}" in line and "LISTENING" in line:
                    parts = line.strip().split()
                    pid = parts[-1]
                    print(f"\n[Sistem] Port {port} adresi PID {pid} tarafından kullanılıyor. Sonlandırılıyor...")
                    subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True)
                    time.sleep(1) # Portun serbest kalması için kısa bir süre bekle
                    return True
    except Exception as e:
        print(f"[Uyarı] Port {port} temizlenemedi: {e}")
    return False

# Start simple web server serving current directory ("Mobil App")
Handler = http.server.SimpleHTTPRequestHandler
socketserver.TCPServer.allow_reuse_address = True

try:
    httpd = socketserver.TCPServer(("", PORT), Handler)
except OSError:
    kill_process_on_port(PORT)
    httpd = socketserver.TCPServer(("", PORT), Handler)

with httpd:
    print(f"\n[INFO] Sunucu port {PORT} üzerinde aktif.")
    print("Kapatmak için: Ctrl + C tuşlarına basın.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Sunucu durduruldu.")

