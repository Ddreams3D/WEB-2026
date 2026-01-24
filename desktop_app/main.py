import sys
import os

# Ensure 'scripts' folder is in sys.path so imports like 'from ui.app' work
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import time
import shutil
import subprocess
import tkinter as tk
import customtkinter as ctk
from utils.logger import Logger
from core.parser import GCodeParser
from services.api import ProductionService
from ui.app import MainWindow

def main():
    logger = Logger()
    
    # Configure CustomTkinter
    ctk.set_appearance_mode("Dark")
    ctk.set_default_color_theme("blue")

    # 1. Argument Handling
    if len(sys.argv) < 2:
        file_path = "test_gcode.gcode"
    else:
        file_path = sys.argv[1]

    # 2. Detached Mode Launcher
    if "--worker" not in sys.argv:
        try:
            logger.debug("Launcher started. Spawning worker...")
            temp_dir = os.path.join(os.environ.get('TEMP', os.getcwd()), 'ddreams_temp')
            os.makedirs(temp_dir, exist_ok=True)
            temp_file = os.path.join(temp_dir, f"temp_{int(time.time())}_{os.path.basename(file_path)}")
            
            # Robust copy loop
            max_retries = 5
            for i in range(max_retries):
                try:
                    # Check if source exists and has size
                    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
                        shutil.copy2(file_path, temp_file)
                        break
                    else:
                        logger.debug(f"Source file empty or missing, waiting... ({i+1}/{max_retries})")
                        time.sleep(1)
                except Exception as e:
                    logger.debug(f"Copy failed, retrying... ({i+1}/{max_retries}): {e}")
                    time.sleep(1)
            
            if not os.path.exists(temp_file):
                 logger.error("Failed to copy input file to temp location.")
                 # Fallback: try to pass original path if copy failed
                 temp_file = file_path

            if getattr(sys, 'frozen', False):
                exe_path = sys.executable
                cmd = [exe_path, temp_file, "--worker"]
            else:
                # Running from source - use absolute path to self
                cmd = [sys.executable, os.path.abspath(__file__), temp_file, "--worker"]
                
            subprocess.Popen(cmd, creationflags=0x00000008, close_fds=True)
            sys.exit(0)
        except Exception as e:
            logger.error(f"Launcher failed: {e}")

    # 3. Worker Logic
    if "--worker" in sys.argv:
        sys.argv.remove("--worker")
        file_path = sys.argv[1]

    # 4. Dependency Injection
    parser = GCodeParser(logger)
    service = ProductionService(logger)

    # 5. Launch UI
    root = ctk.CTk()
    app = MainWindow(root, file_path, parser, service)
    
    def on_close():
        root.destroy()
        try:
            if "ddreams_temp" in file_path:
                os.remove(file_path)
        except: pass
    
    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()

if __name__ == "__main__":
    main()
