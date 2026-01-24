import sys
import os
import re
import json
import time
import urllib.request
import urllib.error
import base64
import threading
import subprocess
import shutil
from datetime import datetime
import io

import tkinter as tk
from tkinter import ttk, messagebox
from tkinter import PhotoImage

# ==========================================
# ⚙️ CONFIGURACIÓN USUARIO
# ==========================================
API_BASE = "http://localhost:3000/api/production"
API_URL = f"{API_BASE}/slicer-hook"
API_PRODUCTS_URL = f"{API_BASE}/products-list"

SECRET_TOKEN = "tu_secreto_super_seguro" 
SCRIPT_VERSION = "3.5.0"

# ==========================================
# 🛠️ LOGGING & UTILS
# ==========================================

def get_log_path(filename):
    """Retorna ruta absoluta para logs en directorio del usuario"""
    return os.path.join(os.path.expanduser("~"), filename)

def log_debug(msg):
    try:
        path = get_log_path("ddreams_debug.txt")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(path, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {msg}\n")
    except: pass

def log_error(msg):
    print(f"ERROR: {msg}")
    log_debug(f"ERROR: {msg}")
    try:
        path = get_log_path("ddreams_error.log")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(path, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {msg}\n")
    except: pass

# ==========================================
# 🔍 G-CODE PARSING
# ==========================================

def parse_gcode(file_path):
    """
    Parsea G-code buscando:
    1. DDREAMS DATA BLOCK (Prioridad)
    2. Bambu/Prusa comments (Fallback)
    3. Thumbnail
    4. Multicolor stats
    """
    stats = {
        'grams': 0.0,
        'time': 0,
        'filament_type': 'Unknown',
        'machine_type': 'FDM',
        'quality_profile': 'Standard',
        'printer_model': 'Unknown',
        'nozzle': 'Unknown',
        'layers': 0,
        'meters': 0.0,
        'multicolor_changes': 0,
        'thumbnail_b64': None
    }
    
    # Patrones Regex
    patterns = {
        'time': r"; estimated printing time \(normal mode\) = (.*)", # h m s
        'filament_grams': r"; filament used \[g\] = (.*)",
        'filament_meters': r"; filament used \[mm\] = (.*)",
        'filament_type': r"; filament_type = (.*)",
        'total_layers': r"; total layers count = (\d+)",
        # Fallbacks
        'printer_model': r"; printer_model = (.*)",
    }
    
    # DDREAMS Specific Patterns (Forced via Start G-code)
    dd_patterns = {
        'quality_profile': r"; ddreams_layer_height\s*=\s*(.*)",
        'filament_type': r"; ddreams_filament_type\s*=\s*(.*)",
        'printer_model': r"; ddreams_printer_model\s*=\s*(.*)",
        'nozzle': r"; ddreams_nozzle\s*=\s*(.*)"
    }

    try:
        # Esperar a que el archivo esté listo (Bambu a veces tarda en liberar el lock)
        max_retries = 3
        content = ""
        for i in range(max_retries):
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                break
            except Exception as e:
                time.sleep(1)
                if i == max_retries - 1: raise e

        # 1. Parseo Básico (Regex)
        for key, pat in patterns.items():
            match = re.search(pat, content)
            if match:
                val = match.group(1).strip()
                if key == 'filament_grams': stats['grams'] = float(val)
                elif key == 'filament_meters': stats['meters'] = float(val) / 1000.0 # mm to m
                elif key == 'filament_type': stats['filament_type'] = val.replace('"', '')
                elif key == 'total_layers': stats['layers'] = int(val)
                elif key == 'printer_model': stats['printer_model'] = val
                elif key == 'time':
                    # Parse time format: 1h 30m 20s
                    h, m, s = 0, 0, 0
                    if 'h' in val: h = int(re.search(r'(\d+)h', val).group(1))
                    if 'm' in val: m = int(re.search(r'(\d+)m', val).group(1))
                    if 's' in val: s = int(re.search(r'(\d+)s', val).group(1))
                    stats['time'] = h * 60 + m + (1 if s > 30 else 0)

        # 2. DDREAMS Overrides (Mayor precisión si existen)
        for key, pat in dd_patterns.items():
            match = re.search(pat, content)
            if match:
                val = match.group(1).strip()
                stats[key] = val

        # 3. Multicolor Changes (Count 'T' commands)
        # Buscar cambios de herramienta (T0, T1, etc) excluyendo comentarios
        # Estrategia simple: buscar T[digit] al inicio de linea o despues de espacio
        t_matches = re.findall(r'(?m)^T\d+', content)
        if len(t_matches) > 1:
            stats['multicolor_changes'] = len(t_matches) - 1 # Restar inicial
        else:
            stats['multicolor_changes'] = 0

        # 4. Thumbnail Extraction
        # Format: ; thumbnail begin 300x300 12345 ... ; thumbnail end
        thumb_match = re.search(r'; thumbnail begin \d+x\d+ \d+\n((?:.|\n)*?); thumbnail end', content)
        if thumb_match:
            raw_b64 = thumb_match.group(1).replace('; ', '').replace('\n', '')
            stats['thumbnail_b64'] = raw_b64

        # Inferencia Machine Type
        if 'Resin' in stats['printer_model'] or 'SLA' in stats['printer_model']:
            stats['machine_type'] = 'RESIN'
        
        return stats

    except Exception as e:
        log_error(f"Error parsing G-code: {e}")
        return stats

# ==========================================
# 🖥️ GUI APPLICATION
# ==========================================

class DdreamsApp:
    def __init__(self, root, file_path, stats):
        self.root = root
        self.root.title(f"DDREAMS Linker v{SCRIPT_VERSION}")
        self.root.geometry("600x450")
        self.root.resizable(False, False)
        
        self.file_path = file_path
        self.stats = stats
        self.products = []
        self.selected_product = None

        # Style
        style = ttk.Style()
        style.theme_use('clam')
        
        # Main Container (2 Columns)
        main_frame = ttk.Frame(root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # --- LEFT COLUMN (Image & Stats) ---
        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))

        # Thumbnail
        self.canvas = tk.Canvas(left_frame, width=250, height=250, bg='#f0f0f0', highlightthickness=0)
        self.canvas.pack(pady=(0, 10))
        self.load_thumbnail()

        # Mini Stats Grid
        stats_frame = ttk.LabelFrame(left_frame, text="Datos Extraídos", padding="5")
        stats_frame.pack(fill=tk.X)
        
        ttk.Label(stats_frame, text=f"Peso: {stats['grams']}g").pack(anchor='w')
        ttk.Label(stats_frame, text=f"Tiempo: {stats['time']} min").pack(anchor='w')
        ttk.Label(stats_frame, text=f"Cambios Color: {stats['multicolor_changes']}").pack(anchor='w')
        ttk.Label(stats_frame, text=f"Capas: {stats['layers']}").pack(anchor='w')

        # --- RIGHT COLUMN (Form) ---
        right_frame = ttk.Frame(main_frame)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # 1. Product Selector
        ttk.Label(right_frame, text="Vincular a Producto (Opcional):").pack(anchor='w')
        self.product_var = tk.StringVar()
        self.combo_products = ttk.Combobox(right_frame, textvariable=self.product_var, state="readonly")
        self.combo_products.pack(fill=tk.X, pady=(0, 10))
        self.combo_products.bind("<<ComboboxSelected>>", self.on_product_select)

        # 2. Name Field
        ttk.Label(right_frame, text="Nombre Identificador:").pack(anchor='w')
        self.name_var = tk.StringVar(value=os.path.basename(file_path))
        entry_name = ttk.Entry(right_frame, textvariable=self.name_var)
        entry_name.pack(fill=tk.X, pady=(0, 10))

        # 3. Hidden Data Info
        info_text = f"Archivo: {os.path.basename(file_path)}\n" \
                    f"Impresora: {stats['printer_model']}\n" \
                    f"Perfil: {stats['quality_profile']}\n" \
                    f"Filamento: {stats['filament_type']}"
        lbl_info = ttk.Label(right_frame, text=info_text, foreground="gray", font=("Arial", 8))
        lbl_info.pack(anchor='w', pady=(10, 20))

        # 4. Buttons
        btn_frame = ttk.Frame(right_frame)
        btn_frame.pack(fill=tk.X, side=tk.BOTTOM)

        self.btn_send = ttk.Button(btn_frame, text="Enviar a Inbox", command=self.send_data)
        self.btn_send.pack(side=tk.RIGHT, padx=5)
        
        ttk.Button(btn_frame, text="Cancelar", command=root.destroy).pack(side=tk.RIGHT)

        # Async Load Products
        threading.Thread(target=self.load_products, daemon=True).start()

    def load_thumbnail(self):
        """Decode base64 thumbnail and show in canvas"""
        if self.stats.get('thumbnail_b64'):
            try:
                data = base64.b64decode(self.stats['thumbnail_b64'])
                # Tkinter PhotoImage doesn't support raw PNG data easily without PIL
                # But recent Tkinter versions support PNG. Let's try.
                self.img = tk.PhotoImage(data=data)
                # Resize if needed? Tkinter PhotoImage can only subsample (shrink)
                # Assuming 300x300 usually fits.
                # If too big, subsample
                if self.img.width() > 250:
                    factor = int(self.img.width() / 250) + 1
                    self.img = self.img.subsample(factor)
                
                self.canvas.create_image(125, 125, image=self.img, anchor='center')
            except Exception as e:
                log_error(f"Thumbnail error: {e}")
                self.canvas.create_text(125, 125, text="No Image")
        else:
            self.canvas.create_text(125, 125, text="No Thumbnail")

    def load_products(self):
        """Fetch products from API"""
        try:
            req = urllib.request.Request(f"{API_PRODUCTS_URL}?secret_token={SECRET_TOKEN}")
            with urllib.request.urlopen(req, timeout=5) as res:
                if res.getcode() == 200:
                    data = json.loads(res.read())
                    self.products = data
                    product_names = [f"{p['name']}" for p in self.products]
                    
                    def update_ui():
                        self.combo_products['values'] = product_names
                    self.root.after(0, update_ui)
        except Exception as e:
            log_error(f"Failed to load products: {e}")

    def on_product_select(self, event):
        idx = self.combo_products.current()
        if idx >= 0:
            self.selected_product = self.products[idx]
            # Auto-update button text
            self.btn_send.config(text="Vincular y Guardar")
            # Auto-fill name if empty or default
            if self.name_var.get() == os.path.basename(self.file_path):
                self.name_var.set(self.selected_product['name'])

    def send_data(self):
        payload = {
            "secret_token": SECRET_TOKEN,
            "name": self.name_var.get(),
            "fileName": os.path.basename(self.file_path),
            "grams": self.stats['grams'],
            "time": self.stats['time'],
            "machineType": self.stats['machine_type'],
            "filamentType": self.stats['filament_type'],
            "qualityProfile": self.stats['quality_profile'],
            "printerModel": self.stats['printer_model'],
            "nozzleDiameter": self.stats['nozzle'],
            "totalLayers": self.stats['layers'],
            "filamentLengthMeters": self.stats['meters'],
            "multicolorChanges": self.stats['multicolor_changes'],
            "fileSize": os.path.getsize(self.file_path),
            "fileTimestamp": int(os.path.getmtime(self.file_path) * 1000),
            "scriptVersion": SCRIPT_VERSION,
        }

        if self.selected_product:
            payload['linkedProductId'] = self.selected_product['id']

        # Send to API
        try:
            req = urllib.request.Request(API_URL)
            req.add_header('Content-Type', 'application/json; charset=utf-8')
            jsondata = json.dumps(payload).encode('utf-8')
            req.add_header('Content-Length', len(jsondata))
            
            with urllib.request.urlopen(req, data=jsondata, timeout=10) as response:
                if response.getcode() == 200:
                    messagebox.showinfo("Éxito", "Datos enviados correctamente.")
                    self.root.destroy()
                else:
                    messagebox.showerror("Error", f"API Error: {response.getcode()}")
        except Exception as e:
            log_error(f"Send error: {e}")
            messagebox.showerror("Error", f"Fallo al enviar: {e}")

# ==========================================
# 🚀 ENTRY POINT
# ==========================================

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Modo Test sin argumentos
        file_path = "test_gcode.gcode" 
        # Si queremos probar el modo detached localmente, podemos simular:
        # sys.argv.append("test_gcode.gcode")
    else:
        file_path = sys.argv[1]

    # DETACHED MODE LOGIC
    # Si NO viene el flag --worker, somos el Launcher.
    # El Launcher copia el archivo, lanza el Worker y se muere rápido.
    if "--worker" not in sys.argv:
        try:
            log_debug("Launcher started. Spawning detached worker...")
            
            # 1. Copiar archivo a TEMP para evitar bloqueos/borrados por Bambu
            temp_dir = os.path.join(os.environ.get('TEMP', os.getcwd()), 'ddreams_temp')
            os.makedirs(temp_dir, exist_ok=True)
            temp_file = os.path.join(temp_dir, f"temp_{int(time.time())}_{os.path.basename(file_path)}")
            
            # Esperar un poco a que Bambu libere el archivo si es necesario
            time.sleep(1) 
            shutil.copy2(file_path, temp_file)
            
            # 2. Preparar comando para lanzar el mismo ejecutable (o script)
            # sys.executable apunta al python.exe o al .exe compilado
            # sys.argv[0] es la ruta al script o .exe
            
            if getattr(sys, 'frozen', False):
                # Si estamos compilados (PyInstaller)
                exe_path = sys.executable
                cmd = [exe_path, temp_file, "--worker"]
            else:
                # Si corremos como script .py
                cmd = [sys.executable, sys.argv[0], temp_file, "--worker"]
                
            # 3. Lanzar proceso DETACHED (Windows Specific)
            # DETACHED_PROCESS = 0x00000008
            subprocess.Popen(cmd, creationflags=0x00000008, close_fds=True)
            
            log_debug("Worker spawned. Exiting Launcher.")
            sys.exit(0) # ¡Adios Bambu!
            
        except Exception as e:
            log_error(f"Launcher failed: {e}")
            # Si falla el launcher, intentamos correr normal (fallback)
            pass

    # Si llegamos aquí, somos el Worker (o falló el Launcher y corremos directo)
    # Limpiar flag --worker de argv para no confundir nada más
    if "--worker" in sys.argv:
        sys.argv.remove("--worker")
        # Actualizar file_path al temporal
        file_path = sys.argv[1]

    # Parse G-code
    stats = parse_gcode(file_path)
    log_debug(f"Parsed stats: {stats}")

    # Launch GUI
    root = tk.Tk()
    app = DdreamsApp(root, file_path, stats)
    
    # Al cerrar la ventana, intentar borrar el temp si existe
    def on_close():
        root.destroy()
        try:
            if "ddreams_temp" in file_path:
                os.remove(file_path)
        except: pass
        
    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()
