import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import threading
import base64
import io
import os
from PIL import Image
from domain.models import GCodeStats, Product
from core.parser import GCodeParser
from services.api import ProductionService
from config import VERSION

class MainWindow:
    def __init__(self, root: ctk.CTk, file_path: str, parser: GCodeParser, service: ProductionService):
        self.root = root
        self.file_path = file_path
        self.parser = parser
        self.service = service
        self.stats = GCodeStats()
        self.products = []
        self.selected_product = None

        self._setup_ui()
        self._load_data()

    def _setup_ui(self):
        self.root.title(f"DDREAMS Linker Enterprise v{VERSION}")
        self.root.geometry("1000x700")
        
        # Main Layout
        self.main_frame = ctk.CTkFrame(self.root)
        self.main_frame.pack(fill="both", expand=True, padx=10, pady=10)

        # Left Column (Preview & Stats)
        self.left_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.left_frame.pack(side="left", fill="both", expand=True, padx=(0, 10))

        # Thumbnail
        self.preview_container = ctk.CTkFrame(self.left_frame, width=300, height=300)
        self.preview_container.pack(pady=(0, 10))
        self.preview_container.pack_propagate(False) # Fixed size
        
        self.preview_label = ctk.CTkLabel(self.preview_container, text="No Preview")
        self.preview_label.place(relx=0.5, rely=0.5, anchor="center")

        # Stats
        self.stats_frame = ctk.CTkScrollableFrame(self.left_frame, label_text="Estadísticas de Impresión")
        self.stats_frame.pack(fill="both", expand=True)

        # Right Column (Controls)
        self.right_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.right_frame.pack(side="right", fill="both", expand=True, padx=(10, 0))

        # Toolbar
        self.toolbar = ctk.CTkFrame(self.right_frame)
        self.toolbar.pack(fill="x", pady=(0, 20))
        
        ctk.CTkButton(self.toolbar, text="🔄 Recargar", command=self._reload_data, width=80).pack(side="left", padx=5, pady=5)
        ctk.CTkButton(self.toolbar, text="🔍 G-Code", command=self._show_gcode_preview, width=80).pack(side="left", padx=5, pady=5)
        ctk.CTkButton(self.toolbar, text="⚙️ Setup", command=self._show_bambu_setup, width=80, fg_color="#546E7A", hover_color="#455A64").pack(side="left", padx=5, pady=5)
        ctk.CTkButton(self.toolbar, text="🪄 Calibrar", command=self._open_calibration, width=80, fg_color="#D81B60", hover_color="#AD1457").pack(side="left", padx=5, pady=5)

        # Form
        self.form_frame = ctk.CTkFrame(self.right_frame)
        self.form_frame.pack(fill="both", expand=True)
        
        ctk.CTkLabel(self.form_frame, text="Vincular a Producto:", font=("Arial", 14, "bold")).pack(anchor="w", padx=15, pady=(15, 5))
        self.combo_products = ctk.CTkComboBox(self.form_frame, values=["Cargando..."], command=self._on_product_select)
        self.combo_products.pack(fill="x", padx=15, pady=(0, 15))

        ctk.CTkLabel(self.form_frame, text="Nombre del Proyecto:", font=("Arial", 14, "bold")).pack(anchor="w", padx=15, pady=5)
        self.name_var = tk.StringVar(value=os.path.basename(self.file_path))
        self.entry_name = ctk.CTkEntry(self.form_frame, textvariable=self.name_var)
        self.entry_name.pack(fill="x", padx=15, pady=(0, 20))

        # Action Buttons
        self.btn_send = ctk.CTkButton(self.form_frame, text="ENVIAR A PRODUCCIÓN", command=self._send, height=50, font=("Arial", 16, "bold"), fg_color="#2E7D32", hover_color="#1B5E20")
        self.btn_send.pack(side="bottom", fill="x", padx=15, pady=20)
        
        ctk.CTkButton(self.form_frame, text="Cancelar", command=self.root.destroy, fg_color="transparent", border_width=1, text_color=("gray10", "#DCE4EE")).pack(side="bottom", fill="x", padx=15, pady=(0, 5))

    def _load_data(self):
        threading.Thread(target=self._fetch_products, daemon=True).start()
        try:
            self.stats = self.parser.parse_file(self.file_path)
            self._update_stats_ui()
        except Exception as e:
            messagebox.showerror("Error de Carga", f"No se pudo analizar el archivo:\n{e}")

    def _fetch_products(self):
        try:
            self.products = self.service.get_products()
            product_names = [p.name for p in self.products]
            # Update combo in main thread
            self.root.after(0, lambda: self.combo_products.configure(values=product_names))
        except Exception as e:
            print(f"Error fetching products: {e}")

    def _update_stats_ui(self):
        for w in self.stats_frame.winfo_children(): w.destroy()
        
        if not self.stats: return

        # Helper
        def add_row(label, value):
            row = ctk.CTkFrame(self.stats_frame, fg_color="transparent")
            row.pack(fill="x", pady=2)
            ctk.CTkLabel(row, text=label, width=140, anchor="w", font=("Arial", 12, "bold"), text_color=("gray40", "gray70")).pack(side="left")
            ctk.CTkLabel(row, text=str(value), anchor="w", font=("Arial", 12)).pack(side="left", fill="x", expand=True)

        # Data formatting
        time_str = "N/A"
        if self.stats.time_minutes:
            h, m = divmod(self.stats.time_minutes, 60)
            time_str = f"{h}h {m}m" if h > 0 else f"{m}m"
        
        add_row("Tiempo Estimado", time_str)
        add_row("Peso (g)", f"{self.stats.grams:.2f}g" if self.stats.grams else "N/A")
        add_row("Longitud (m)", f"{self.stats.filament_length_m:.2f}m" if self.stats.filament_length_m else "N/A")
        add_row("Filamento", (self.stats.filament_type or "N/A")[:30])
        add_row("Capas", self.stats.total_layers or "N/A")
        add_row("Impresora", (self.stats.printer_model or "N/A")[:30])

        # Image
        if self.stats.thumbnail_b64:
            try:
                data = base64.b64decode(self.stats.thumbnail_b64)
                pil_img = Image.open(io.BytesIO(data))
                # Resize
                ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(280, 280))
                self.preview_label.configure(image=ctk_img, text="")
            except Exception as e:
                print(f"Thumbnail error: {e}")

    def _on_product_select(self, choice):
        # Find product by name
        for p in self.products:
            if p.name == choice:
                self.selected_product = p
                self.btn_send.configure(text=f"Vincular a: {p.name[:20]}...")
                if self.name_var.get() == os.path.basename(self.file_path):
                    self.name_var.set(p.name)
                break

    def _send(self):
        success = self.service.send_data(
            self.stats, 
            os.path.basename(self.file_path),
            self.selected_product.id if self.selected_product else None,
            self.name_var.get(),
            VERSION
        )
        if success:
            messagebox.showinfo("Éxito", "Datos enviados correctamente.")
            self.root.destroy()
        else:
            messagebox.showerror("Error", "Fallo al enviar datos.")

    def _reload_data(self):
        self.stats = self.parser.parse_file(self.file_path)
        self._update_stats_ui()
        messagebox.showinfo("Info", "Datos recargados.")

    def _show_gcode_preview(self):
        top = ctk.CTkToplevel(self.root)
        top.title("Vista Previa G-Code")
        top.geometry("700x500")
        top.attributes("-topmost", True)
        
        textbox = ctk.CTkTextbox(top, font=("Consolas", 12))
        textbox.pack(fill="both", expand=True, padx=10, pady=10)
        
        try:
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(15000)
                textbox.insert("0.0", content)
                if len(content) == 15000:
                    textbox.insert("end", "\n\n... [TRUNCADO] ...")
        except Exception as e:
            textbox.insert("0.0", f"Error: {e}")
        
        textbox.configure(state="disabled")

    def _show_bambu_setup(self):
        top = ctk.CTkToplevel(self.root)
        top.title("Configuración Bambu Studio")
        top.geometry("600x450")
        top.attributes("-topmost", True)

        ctk.CTkLabel(top, text="Configuración para Bambu Studio", font=("Arial", 18, "bold")).pack(pady=(20, 10))
        
        msg = ("Para obtener la máxima precisión en Calidad, Boquilla y Modelo,\n"
               "copia el siguiente bloque y pégalo en el 'Start G-code' de tu impresora\n"
               "en Bambu Studio (Printer Settings -> Machine G-code).")
        ctk.CTkLabel(top, text=msg, font=("Arial", 12)).pack(pady=10, padx=20)

        code_snippet = (
            "; ddreams_layer_height = [layer_height]\n"
            "; ddreams_filament_type = [filament_type[0]]\n"
            "; ddreams_printer_model = [printer_model]\n"
            "; ddreams_nozzle = [nozzle_diameter[0]]"
        )
        
        textbox = ctk.CTkTextbox(top, font=("Consolas", 12), height=100)
        textbox.pack(fill="x", padx=20, pady=10)
        textbox.insert("0.0", code_snippet)
        textbox.configure(state="disabled")

        def copy_to_clipboard():
            self.root.clipboard_clear()
            self.root.clipboard_append(code_snippet)
            self.root.update()
            btn_copy.configure(text="¡Copiado!", fg_color="#2E7D32")
            top.after(2000, lambda: btn_copy.configure(text="📋 Copiar al Portapapeles", fg_color="#1F6AA5"))

        btn_copy = ctk.CTkButton(top, text="📋 Copiar al Portapapeles", command=copy_to_clipboard, height=40, font=("Arial", 14, "bold"))
        btn_copy.pack(pady=20)
        
        ctk.CTkButton(top, text="Cerrar", command=top.destroy, fg_color="transparent", border_width=1, text_color=("gray10", "#DCE4EE")).pack(pady=(0, 20))

    def _open_calibration(self):
        top = ctk.CTkToplevel(self.root)
        top.title("Asistente de Calibración")
        top.geometry("600x700")
        top.attributes("-topmost", True)

        ctk.CTkLabel(top, text="Selecciona los valores correctos para calibrar:", font=("Arial", 16, "bold")).pack(pady=10)
        
        scroll = ctk.CTkScrollableFrame(top)
        scroll.pack(fill="both", expand=True, padx=10, pady=10)

        candidates = self.parser.scan_candidates(self.file_path)
        vars_map = {}

        def create_section(title, key, lines):
            f = ctk.CTkFrame(scroll)
            f.pack(fill="x", pady=5)
            ctk.CTkLabel(f, text=title, font=("Arial", 12, "bold")).pack(anchor="w", padx=5)
            
            if not lines:
                ctk.CTkLabel(f, text="No encontrado", text_color="gray").pack(anchor="w", padx=5)
                return

            v = ctk.StringVar(value=lines[0])
            cb = ctk.CTkComboBox(f, values=lines, variable=v)
            cb.pack(fill="x", padx=5, pady=5)
            vars_map[key] = v

        create_section("Tiempo Estimado", 'time', candidates.get('time', []))
        create_section("Peso (g)", 'filament_grams', candidates.get('filament_grams', []))
        create_section("Modelo Impresora", 'printer_model', candidates.get('printer_model', []))
        create_section("Tipo Filamento", 'filament_type', candidates.get('filament_type', []))
        create_section("Capas", 'total_layers', candidates.get('total_layers', []))

        def save():
            report = []
            count = 0
            for key, var in vars_map.items():
                val = var.get()
                if val:
                    success, msg, _ = self.parser.learn_pattern(key, val)
                    report.append(f"{'✅' if success else '❌'} {key}: {msg}")
                    if success: count += 1
            
            if count > 0:
                messagebox.showinfo("Calibración", f"Patrones actualizados: {count}\n\n" + "\n".join(report))
                top.destroy()
                self._reload_data()
            else:
                messagebox.showerror("Error", "No se pudo calibrar nada.\n\n" + "\n".join(report))

        ctk.CTkButton(top, text="GUARDAR CALIBRACIÓN", command=save, fg_color="#D81B60", hover_color="#AD1457").pack(pady=20)
