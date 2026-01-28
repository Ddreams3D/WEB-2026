import math
import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import threading
import base64
import io
import os
import webbrowser
from PIL import Image
from domain.models import GCodeStats, Product
from core.parser import GCodeParser
from services.api import ProductionService
from config import VERSION, WEB_URL

class MainWindow:
    def __init__(self, root: ctk.CTk, file_path: str, parser: GCodeParser, service: ProductionService):
        self.root = root
        self.parser = parser
        self.service = service
        
        # State
        self.plates = [] # List of dicts: {'path': str, 'stats': GCodeStats}
        self.stats = GCodeStats() # Aggregated stats (Totals)
        self.products = []
        self.selected_product = None
        
        self._setup_ui()
        
        # Load initial file
        self.add_plate(file_path)
        
        # Load products
        threading.Thread(target=self._fetch_products, daemon=True).start()

    def add_plate(self, file_path: str):
        """Parses and adds a new plate/file to the session."""
        try:
            # Check if already exists to avoid duplicates (optional, but good for idempotency)
            if any(p['path'] == file_path for p in self.plates):
                return

            stats = self.parser.parse_file(file_path)
            self.plates.append({'path': file_path, 'stats': stats})
            
            self._recalculate_totals()
            self._update_stats_ui()
            
            # Update name if it's the first one
            if len(self.plates) == 1:
                self.name_var.set(os.path.basename(file_path))
                
        except Exception as e:
            messagebox.showerror("Error", f"Error al procesar bandeja:\n{e}")

    def _recalculate_totals(self):
        """Aggregates stats from all plates."""
        if not self.plates:
            self.stats = GCodeStats()
            return

        total_grams = 0.0
        total_time = 0
        total_meters = 0.0
        total_layers = 0 # Sum of layers (total work done)
        multicolor = 0
        
        filaments = set()
        machines = set()
        printers = set()
        
        last_thumb = None

        for p in self.plates:
            s = p['stats']
            total_grams += s.grams
            total_time += s.time_minutes
            total_meters += s.filament_length_m
            total_layers += s.total_layers
            multicolor += s.multicolor_changes
            
            if s.filament_type: filaments.add(s.filament_type)
            if s.machine_type: machines.add(s.machine_type)
            if s.printer_model: printers.add(s.printer_model)
            
            if s.thumbnail_b64:
                last_thumb = s.thumbnail_b64

        # Update aggregated object
        self.stats.grams = math.ceil(total_grams)
        self.stats.time_minutes = total_time
        self.stats.filament_length_m = total_meters
        self.stats.total_layers = total_layers
        self.stats.multicolor_changes = multicolor
        self.stats.filament_type = ", ".join(sorted(filaments))
        self.stats.machine_type = list(machines)[0] if machines else "FDM"
        self.stats.printer_model = list(printers)[0] if printers else "Unknown"
        self.stats.thumbnail_b64 = last_thumb

    def _setup_ui(self):
        self.root.title(f"DDREAMS Linker Enterprise v{VERSION}")
        self.root.geometry("1100x750")
        
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

        # Stats Container
        self.stats_container = ctk.CTkFrame(self.left_frame, fg_color="transparent")
        self.stats_container.pack(fill="both", expand=True)

        # Total Stats (Resumen)
        self.total_frame = ctk.CTkFrame(self.stats_container)
        self.total_frame.pack(fill="x", pady=(0, 10))
        ctk.CTkLabel(self.total_frame, text="RESUMEN TOTAL", font=("Arial", 14, "bold")).pack(pady=5)
        
        # Plates List
        ctk.CTkLabel(self.stats_container, text="Bandejas Individuales:", font=("Arial", 12, "bold")).pack(anchor="w")
        self.plates_frame = ctk.CTkScrollableFrame(self.stats_container, height=200)
        self.plates_frame.pack(fill="both", expand=True)

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

        # Mode Selection
        ctk.CTkLabel(self.form_frame, text="Destino:", font=("Arial", 14, "bold")).pack(anchor="w", padx=15, pady=(15, 5))
        self.mode_var = tk.StringVar(value="product")
        
        self.radio_product = ctk.CTkRadioButton(self.form_frame, text="Vincular a Producto", variable=self.mode_var, value="product", command=self._update_mode_ui)
        self.radio_product.pack(anchor="w", padx=15, pady=2)
        
        self.radio_quote = ctk.CTkRadioButton(self.form_frame, text="Enviar a Cotizador", variable=self.mode_var, value="quote", command=self._update_mode_ui)
        self.radio_quote.pack(anchor="w", padx=15, pady=2)
        
        ctk.CTkLabel(self.form_frame, text="Seleccionar Producto:", font=("Arial", 14, "bold")).pack(anchor="w", padx=15, pady=(15, 5))
        self.combo_products = ctk.CTkComboBox(self.form_frame, values=[], command=self._on_product_select, state="readonly")
        self.combo_products.set("Seleccionar producto...")
        self.combo_products.pack(fill="x", padx=15, pady=(0, 15))

        ctk.CTkLabel(self.form_frame, text="Nombre del Proyecto:", font=("Arial", 14, "bold")).pack(anchor="w", padx=15, pady=5)
        self.name_var = tk.StringVar(value="")
        self.entry_name = ctk.CTkEntry(self.form_frame, textvariable=self.name_var)
        self.entry_name.pack(fill="x", padx=15, pady=(0, 20))

        # Action Buttons
        self.btn_send = ctk.CTkButton(self.form_frame, text="ENVIAR A PRODUCCIÓN", command=self._send, height=50, font=("Arial", 16, "bold"), fg_color="#2E7D32", hover_color="#1B5E20")
        self.btn_send.pack(side="bottom", fill="x", padx=15, pady=(10, 20))
        
        # Clear Data Button
        ctk.CTkButton(self.form_frame, text="🗑️ Limpiar Datos", command=self._clear_data, fg_color="#C62828", hover_color="#B71C1C").pack(side="bottom", fill="x", padx=15, pady=(0, 5))
        
        ctk.CTkButton(self.form_frame, text="Cancelar", command=self.root.destroy, fg_color="transparent", border_width=1, text_color=("gray10", "#DCE4EE")).pack(side="bottom", fill="x", padx=15, pady=(0, 5))

    def _clear_data(self):
        """Clears all loaded plates and resets the session."""
        if not self.plates:
            return
            
        if messagebox.askyesno("Confirmar", "¿Estás seguro de que quieres limpiar todos los datos?"):
            self.plates = []
            self.stats = GCodeStats()
            self.name_var.set("")
            self.preview_label.configure(image=None, text="No Preview")
            self._recalculate_totals()
            self._update_stats_ui()
            messagebox.showinfo("Limpieza", "Datos eliminados correctamente.")


    def _fetch_products(self):
        try:
            self.products = self.service.get_products()
            product_names = [p.name for p in self.products]
            
            def update():
                self.combo_products.configure(values=product_names)
                self.combo_products.set("Seleccionar producto...")

            # Update combo in main thread
            self.root.after(0, update)
        except Exception as e:
            print(f"Error fetching products: {e}")

    def _update_stats_ui(self):
        # 1. Update Totals
        for w in self.total_frame.winfo_children(): 
            if isinstance(w, ctk.CTkFrame): w.destroy() # Keep header label
            
        def add_total_row(label, value, parent):
            row = ctk.CTkFrame(parent, fg_color="transparent")
            row.pack(fill="x", pady=2, padx=10)
            ctk.CTkLabel(row, text=label, width=140, anchor="w", font=("Arial", 12, "bold"), text_color=("gray40", "gray70")).pack(side="left")
            ctk.CTkLabel(row, text=str(value), anchor="w", font=("Arial", 12)).pack(side="left", fill="x", expand=True)

        # Time formatting
        d, remainder = divmod(self.stats.time_minutes, 1440)
        h, m = divmod(remainder, 60)
        
        if d > 0:
            time_str = f"{int(d)}d {int(h)}h {int(m)}m"
        elif h > 0:
            time_str = f"{int(h)}h {int(m)}m"
        else:
            time_str = f"{int(m)}m"
        
        add_total_row("Tiempo Total", time_str, self.total_frame)

        # Weight formatting
        if self.stats.grams >= 1000:
            kgs = int(self.stats.grams // 1000)
            grs = int(self.stats.grams % 1000)
            weight_str = f"{kgs} kgs y {grs} gr"
        else:
            weight_str = f"{int(self.stats.grams)}g"

        add_total_row("Peso Total", weight_str, self.total_frame)
        add_total_row("Longitud Total", f"{self.stats.filament_length_m:.2f}m", self.total_frame)
        add_total_row("Filamento", (self.stats.filament_type or "N/A")[:40], self.total_frame)
        add_total_row("Capas Totales", self.stats.total_layers, self.total_frame)

        # 2. Update Plates List
        for w in self.plates_frame.winfo_children(): w.destroy()
        
        for idx, p in enumerate(self.plates):
            s = p['stats']
            plate_frame = ctk.CTkFrame(self.plates_frame)
            plate_frame.pack(fill="x", pady=2, padx=5)
            
            # Header
            header = ctk.CTkFrame(plate_frame, fg_color="transparent")
            header.pack(fill="x", padx=5, pady=2)
            ctk.CTkLabel(header, text=f"Bandeja #{idx+1}: {os.path.basename(p['path'])}", font=("Arial", 11, "bold")).pack(side="left")
            
            # Mini stats
            details = ctk.CTkFrame(plate_frame, fg_color="transparent")
            details.pack(fill="x", padx=5, pady=2)
            
            pd, prem = divmod(s.time_minutes, 1440)
            ph, pm = divmod(prem, 60)
            
            if pd > 0:
                p_time = f"{int(pd)}d {int(ph)}h {int(pm)}m"
            else:
                p_time = f"{int(ph)}h {int(pm)}m"
            
            ctk.CTkLabel(details, text=f"⏳ {p_time}", font=("Arial", 10)).pack(side="left", padx=(0, 10))
            ctk.CTkLabel(details, text=f"⚖️ {s.grams:.1f}g", font=("Arial", 10)).pack(side="left", padx=(0, 10))
            ctk.CTkLabel(details, text=f"🧵 {s.filament_type}", font=("Arial", 10)).pack(side="left")

        # 3. Update Image
        if self.stats.thumbnail_b64:
            try:
                data = base64.b64decode(self.stats.thumbnail_b64)
                pil_img = Image.open(io.BytesIO(data))
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
                # If name is default or empty, set to product name
                current_name = self.name_var.get()
                if not current_name or current_name.endswith(".gcode"):
                    self.name_var.set(p.name)
                break

    def _update_mode_ui(self):
        mode = self.mode_var.get()
        if mode == 'quote':
            self.combo_products.configure(state="disabled")
            self.btn_send.configure(text="ENVIAR A COTIZADOR", fg_color="#D81B60", hover_color="#AD1457")
        else:
            self.combo_products.configure(state="readonly")
            prod_name = self.selected_product.name if self.selected_product else "Seleccionar producto..."
            self.btn_send.configure(text=f"Vincular a: {prod_name[:15]}...", fg_color="#2E7D32", hover_color="#1B5E20")

    def _send(self):
        # We send the Aggregated Stats (Sum)
        
        # We use the filename of the first plate as the "base filename"
        base_filename = os.path.basename(self.plates[0]['path']) if self.plates else "unknown.gcode"
        if len(self.plates) > 1:
            base_filename = f"[MULTI-PLATE] {base_filename}"

        target_mode = self.mode_var.get()

        try:
            inbox_id = self.service.send_data(
                self.stats, 
                base_filename,
                self.selected_product.id if (self.selected_product and target_mode == 'product') else None,
                self.name_var.get(),
                VERSION,
                target=target_mode
            )
            
            if target_mode == 'quote':
                # Open browser to Admin Finances/Quoter
                try:
                    url = f"{WEB_URL}/admin/finanzas?tab=quoter"
                    if inbox_id:
                        url += f"&inboxId={inbox_id}"
                    webbrowser.open(url)
                except Exception as e:
                    print(f"Error opening browser: {e}")

            messagebox.showinfo("Éxito", f"Datos enviados ({target_mode}).")
            # self.root.destroy() # User requested to keep app open
        except Exception as e:
            messagebox.showerror("Error", f"Fallo al enviar datos:\n{e}")

    def _reload_data(self):
        # Reload all plates
        current_paths = [p['path'] for p in self.plates]
        self.plates = []
        for path in current_paths:
            self.add_plate(path)
        messagebox.showinfo("Info", "Datos recargados.")

    def _show_gcode_preview(self):
        if not self.plates: return
        # Show first plate or create a selector?
        # Simple: Show first plate
        path = self.plates[0]['path']
        
        top = ctk.CTkToplevel(self.root)
        top.title(f"Vista Previa G-Code ({os.path.basename(path)})")
        top.geometry("700x500")
        top.attributes("-topmost", True)
        
        textbox = ctk.CTkTextbox(top, font=("Consolas", 12))
        textbox.pack(fill="both", expand=True, padx=10, pady=10)
        
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
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
            "; ddreams_filament_type = [filament_type]\n"
            "; ddreams_printer_model = [printer_model]\n"
            "; ddreams_nozzle = [nozzle_diameter]"
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
        if not self.plates: return
        path = self.plates[-1]['path'] # Calibrate with latest
        
        top = ctk.CTkToplevel(self.root)
        top.title("Asistente de Calibración")
        top.geometry("600x700")
        top.attributes("-topmost", True)

        ctk.CTkLabel(top, text="Selecciona los valores correctos para calibrar:", font=("Arial", 16, "bold")).pack(pady=10)
        
        scroll = ctk.CTkScrollableFrame(top)
        scroll.pack(fill="both", expand=True, padx=10, pady=10)

        candidates = self.parser.scan_candidates(path)
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
